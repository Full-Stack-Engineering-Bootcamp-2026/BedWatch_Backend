import AppDataSource from "../../../db/data-source";

import { User } from "../../user/entity/user.entity";

import { Bed } from "../../bed/entity/bed.entity";

export const getStaffDashboardRepository =
  async (userId: number) => {

    const userRepo =
      AppDataSource.getRepository(User);

    const bedRepo =
      AppDataSource.getRepository(Bed);

    const user =
      await userRepo.findOne({
        where: {
          id: userId,
        },

        relations: ["ward"],
      });

    if (!user || !user.ward) {
      throw new Error(
        "Ward not assigned"
      );
    }

    const beds =
      await bedRepo.find({
        where: {
          ward: {
            id: user.ward.id,
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

    const formattedBeds =
      beds.map((bed: any) => {

        const latestAdmission =
          bed.admissions?.[0];

        return {
          id: bed.id,

          bed_number:
            bed.bed_number,

          status:
            bed.status,

            patient:
              latestAdmission
                ? {
                    name:
                      latestAdmission
                        .patient.name,

                    age:
                      latestAdmission
                        .patient.age,

                    diagnosis:
                      latestAdmission
                        .patient.reason,

                      admittedAt:
                       latestAdmission?.admitted_at
                                ? new Date(
                                  latestAdmission.admitted_at
                                   ).toLocaleString()
                                               : "N/A",  
                  }
                : null,

            doctor:
              latestAdmission
                ?.patient
                ?.admittingDoctor ||
              "Not Assigned",

            duration: "4 Days",

            priority: "Medium",
          };
        });

    return {
      ward: user.ward,
      beds: formattedBeds,
    };
  };