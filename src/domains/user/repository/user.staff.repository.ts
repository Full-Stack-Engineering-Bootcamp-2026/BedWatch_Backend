import AppDataSource from "../../../db/data-source";

import { User } from "../../user/entity/user.entity";

import {
  Bed,
  BedStatus,
} from "../../bed/entity/bed.entity";

import { AdmissionStatus } from "../../admission/entity/admission.entity";

export const getStaffDashboardRepository =
  async (userId: number) => {

    const userRepo =
      AppDataSource.getRepository(
        User,
      );

    const bedRepo =
      AppDataSource.getRepository(
        Bed,
      );

    const user =
      await userRepo.findOne({
        where: {
          id: userId,
        },

        relations: ["ward"],
      });

    if (!user || !user.ward) {
      throw new Error(
        "Ward not assigned",
      );
    }

    const beds =
      await bedRepo.find({
        where: {
          ward: {
            id:
              user.ward.id,
          },
        },

        relations: {
          admissions: {
            patient: true,
          },
        },

        order: {
          bed_number: "ASC",
        },
      });

    // AUTO CLEANING LOGIC
    for (const bed of beds) {
      if (
        bed.status ===
        BedStatus.CLEANING
      ) {
        const updatedAt =
          new Date(
            bed.updated_at,
          ).getTime();

        const now =
          Date.now();

        const diff =
          now - updatedAt;

    
        if (diff >= 30000) {
          bed.status =
            BedStatus.AVAILABLE;

          await bedRepo.save(
            bed,
          );

          console.log(
            `Bed ${bed.bed_number} auto changed to AVAILABLE`,
          );
        }
      }
    }

    const formattedBeds =
      beds.map((bed: any) => {

        const activeAdmission =
          bed.admissions?.find(
            (admission: any) =>
              admission.status ===
              AdmissionStatus.ACTIVE,
          );

        return {
          id: bed.id,

          bed_number:
            bed.bed_number,

          status:
            bed.status,

          patient:
            activeAdmission
              ? {
                  id:
                    activeAdmission
                      .patient.id,

                  name:
                    activeAdmission
                      .patient.name,

                  age:
                    activeAdmission
                      .patient.age,

                  diagnosis:
                    activeAdmission
                      .patient.reason,

                  admittedAt:
                    activeAdmission?.admitted_at
                      ? new Date(
                          activeAdmission.admitted_at,
                        ).toLocaleString()
                      : "N/A",
                }
              : null,

          doctor:
            "Not Assigned",

          duration:
            "4 Days",

          priority:
            "Medium",
        };
      });

    return {
      ward: user.ward,

      beds:
        formattedBeds,
    };
  };