import AppDataSource from "../../../db/data-source";

import { Service } from "typedi";

import { Patient } from "../../patient/entity/patient.entity";

import {
  Admission,
  AdmissionStatus,
} from "../../admission/entity/admission.entity";

import {
  Bed,
  BedStatus,
} from "../../bed/entity/bed.entity";

import { User } from "../../user/entity/user.entity";

import { StaffDashboardRepository } from "../repository/user.staff.repository";

@Service()
export class StaffDashboardService {
  private patientRepository =
    AppDataSource.getRepository(Patient);

  private admissionRepository =
    AppDataSource.getRepository(Admission);

  private bedRepository =
    AppDataSource.getRepository(Bed);

  private userRepository =
    AppDataSource.getRepository(User);

  private staffDashboardRepository =
    new StaffDashboardRepository();

  public getStaffDashboard =
    async (userId: number) => {

      return await this.staffDashboardRepository.getStaffDashboard(
        userId,
      );
    };

  // FIXED METHOD NAME
  public getAdmissions =
    async (userId: number) => {

      const user =
        await this.userRepository.findOne({
          where: {
            id: userId,
          },

          relations: {
            ward: true,
          },
        });

      if (!user || !user.ward) {
        throw new Error(
          "Ward not assigned",
        );
      }

      const availableBeds =
        await this.bedRepository.find({
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

  public createAdmission =
    async (
      body: any,
      userId: number,
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
        await this.bedRepository.findOne({
          where: {
            id: bed_id,
          },

          relations: {
            ward: true,
          },
        });

      if (!bed) {
        throw new Error(
          "Bed not found",
        );
      }

      if (
        bed.status !==
        BedStatus.AVAILABLE
      ) {
        throw new Error(
          "Bed already occupied",
        );
      }

      const user =
        await this.userRepository.findOne({
          where: {
            id: userId,
          },

          relations: {
            ward: true,
          },
        });

      if (!user) {
        throw new Error(
          "User not found",
        );
      }

      if (
        user.ward?.id !==
        bed.ward.id
      ) {
        throw new Error(
          "Unauthorized bed allocation",
        );
      }

      const patient =
        this.patientRepository.create({
          name,
          age,
          gender,
          reason,
          notes,
          admittingDoctor,
        });

      await this.patientRepository.save(
        patient,
      );

      const admission =
        this.admissionRepository.create({
          patient,
          bed,
          admitted_by: user,
        });

      await this.admissionRepository.save(
        admission,
      );

      bed.status =
        BedStatus.OCCUPIED;

      await this.bedRepository.save(
        bed,
      );

      return admission;
    };

  public dischargePatient =
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

          bed.status =
            BedStatus.CLEANING;

          await manager.save(bed);

          activeAdmission.status =
            AdmissionStatus.DISCHARGED;

          activeAdmission.discharged_at =
            new Date();

          await manager.save(
            activeAdmission,
          );

          setTimeout(async () => {

            try {

              const updatedBed =
                await this.bedRepository.findOne({
                  where: {
                    id: bedId,
                  },
                });

              if (updatedBed) {

                updatedBed.status =
                  BedStatus.AVAILABLE;

                await this.bedRepository.save(
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
}