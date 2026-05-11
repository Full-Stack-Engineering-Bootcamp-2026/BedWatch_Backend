import AppDataSource from "../../../db/data-source";

import { Patient }
  from "../../patient/entity/patient.entity";

import {
  Admission,
} from "../../admission/entity/admission.entity";

import {
  Bed,
  BedStatus,
} from "../../bed/entity/bed.entity";

import { User }
  from "../../user/entity/user.entity";

import {
  getStaffDashboardRepository,
} from "../repository/user.staff.repository";

import {
  AdmissionStatus,
} from "../../admission/entity/admission.entity";

const patientRepository =
  AppDataSource.getRepository(Patient);

const admissionRepository =
  AppDataSource.getRepository(Admission);

const bedRepository =
  AppDataSource.getRepository(Bed);

const userRepository =
  AppDataSource.getRepository(User);

export const getStaffDashboardService =
  async (userId: number) => {

    return await getStaffDashboardRepository(
      userId
    );
  };

  
export const getAdmissionService =
  async (userId: number) => {

    const user =
      await userRepository.findOne({
        where: {
          id: userId,
        },

        relations: {
          ward: true,
        },
      });

    if (!user || !user.ward) {
      throw new Error(
        "Ward not assigned"
      );
    }

    const availableBeds =
      await bedRepository.find({
        where: {
          ward: {
            id: user.ward.id,
          },

          status:
            BedStatus.AVAILABLE,
        },

        order: {
          bed_number: "ASC",
        },
      });

    return {
      ward: user.ward,
      availableBeds,
    };
  };

  export const createAdmissionService =
  async (
    body: any,
    userId: number
  ) => {

    const {
      name,
      age,
      gender,
      reason,
      notes,
      admittingDoctor,
      bed_id,
    } = body;

    const bed =
      await bedRepository.findOne({
        where: {
          id: bed_id,
        },

        relations: {
          ward: true,
        },
      });

    if (!bed) {
      throw new Error(
        "Bed not found"
      );
    }

    if (
      bed.status !==
      BedStatus.AVAILABLE
    ) {
      throw new Error(
        "Bed already occupied"
      );
    }

    const user =
      await userRepository.findOne({
        where: {
          id: userId,
        },

        relations: {
          ward: true,
        },
      });

    if (!user) {
      throw new Error(
        "User not found"
      );
    }

    if (
      user.ward?.id !==
      bed.ward.id
    ) {
      throw new Error(
        "Unauthorized bed allocation"
      );
    }

    const patient =
      patientRepository.create({
        name,
        age,
        gender,
        reason,
        notes,
        admittingDoctor,
      });

    await patientRepository.save(
      patient
    );

    const admission =
      admissionRepository.create({
        patient,
        bed,
        admitted_by: user,
      });

    await admissionRepository.save(
      admission
    );

    bed.status =
      BedStatus.OCCUPIED;

    await bedRepository.save(
      bed
    );

    return admission;
    };
  

 export const dischargePatientService =
  async (bedId: number) => {

    return await AppDataSource.transaction(
      async (manager) => {

        const bed =
          await manager.findOne(
            Bed,
            {
              where: {
                id: bedId,
              },

              relations: {
                admissions: true,
              },
            },
          );

        if (!bed) {
          throw new Error(
            "Bed not found",
          );
        }

        if (
          bed.status ===
          BedStatus.AVAILABLE
        ) {
          throw new Error(
            "Bed already available",
          );
        }

        if (
          bed.status ===
          BedStatus.CLEANING
        ) {
          throw new Error(
            "Bed already under cleaning",
          );
        }

        const activeAdmission =
          bed.admissions?.find(
            (admission: any) =>
              admission.status ===
              AdmissionStatus.ACTIVE,
          );

        if (!activeAdmission) {
          throw new Error(
            "No active admission found",
          );
        }

        // bed cleaning state
        bed.status =
          BedStatus.CLEANING;

        await manager.save(bed);

        // discharge patient
        activeAdmission.status =
          AdmissionStatus.DISCHARGED;

        activeAdmission.discharged_at =
          new Date();

        await manager.save(
          activeAdmission,
        );

        // auto available after 30 sec
        setTimeout(async () => {

          try {

            const updatedBed =
              await bedRepository.findOne({
                where: {
                  id: bedId,
                },
              });

            if (updatedBed) {

              updatedBed.status =
                BedStatus.AVAILABLE;

              await bedRepository.save(
                updatedBed,
              );
            }

          } catch (error) {

            console.log(
              "Cleaning update failed",
              error,
            );
          }

        }, 30000);

        return {

          message:
            "Patient discharged successfully",

          cleaningEndsAt:
            Date.now() + 30000,
        };
      },
    );
  };