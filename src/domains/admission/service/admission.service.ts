import { Service } from "typedi";
import { AppDataSource } from "../../../db/db";

import { Admission, AdmissionStatus } from "../entity/admission.entity";
import { Bed } from "../../bed/entity/bed.entity";
import { Patient } from "../../patient/entity/patient.entity";
import { User, UserRole } from "../../user/entity/user.entity";
import { BedStatus } from "../../bed/entity/bed.entity";

@Service()
export class AdmissionService {
  private admissionRepo = AppDataSource.getRepository(Admission);
  private bedRepo = AppDataSource.getRepository(Bed);
  private patientRepo = AppDataSource.getRepository(Patient);
  private userRepo = AppDataSource.getRepository(User);

  public async admitPatient(patientId: number, bedId: number, userId: number) {
    const patient = await this.patientRepo.findOne({
      where: { id: patientId },
    });

    if (!patient) {
      throw new Error("patient not found");
    }

    const bed = await this.bedRepo.findOne({
      where: { id: bedId },
      relations: ["ward"],
    });

    if (!bed) {
      throw new Error("bed Not found");
    }

    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ["ward"],
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (user.role === UserRole.STAFF) {
      if (!user.ward || user.ward.id !== bed.ward.id) {
        throw new Error("Access Denied - Cannot admit in other ward ");
      }
    }

    if (bed.status !== BedStatus.AVAILABLE) {
      throw new Error("Bed Not Available");
    }

    const existingAdmission = await this.admissionRepo.findOne({
      where: {
        patient: { id: patientId },
        status: AdmissionStatus.ACTIVE,
      },
    });

    if (existingAdmission) {
      throw new Error("Patient is already admitted");
    }

    return await AppDataSource.transaction(async (manager) => {
      const admissionRepo = manager.getRepository(Admission);
      const bedRepo = manager.getRepository(Bed);

      const admission = admissionRepo.create({
        patient,
        bed,
        admitted_by: user,
      });

      await admissionRepo.save(admission);

      bed.status = BedStatus.OCCUPIED;
      await bedRepo.save(bed);

      return admission;
    });
  }

  public async dischargePatient(admissionId: number, userId: number) {
    return await AppDataSource.transaction(async (manager) => {
      const admissionRepo = manager.getRepository(Admission);
      const bedRepo = manager.getRepository(Bed);
      const userRepo = manager.getRepository(User);

      const admission = await admissionRepo.findOne({
        where: { id: admissionId },
        relations: ["bed", "bed.ward"],
      });

      if (!admission) {
        throw new Error("admission not found");
      }

      if (admission.status == AdmissionStatus.DISCHARGED) {
        throw new Error("Patient already discharged");
      }

      const user = await userRepo.findOne({
        where: { id: userId },
        relations: ["ward"],
      });

      if (!user) {
        throw new Error("No User");
      }

      if (user.role === UserRole.STAFF) {
        if (!user.ward || user.ward.id !== admission.bed.ward.id) {
          throw new Error("Access Denied - Cannot discharge in other ward ");
        }
      }

      admission.status = AdmissionStatus.DISCHARGED;
      admission.discharged_at = new Date();
      admission.admitted_by = user;

      await admissionRepo.save(admission);

      const bed = admission.bed;

      // need to add the things  for cleaning wala logic

      bed.status = BedStatus.AVAILABLE;
      await bedRepo.save(bed);

      return admission;
    });
  }
}
