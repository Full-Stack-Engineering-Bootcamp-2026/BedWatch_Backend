import { Service } from "typedi";
import AppDataSource from "../../../db/data-source";
import { Transfer, TransferStatus } from "../entity/transfer.entity";
import {
  Admission,
  AdmissionStatus,
} from "../../admission/entity/admission.entity";
import { Bed, BedStatus } from "../../bed/entity/bed.entity";
import { Patient } from "../../patient/entity/patient.entity";
import { User, UserRole } from "../../user/entity/user.entity";
import { error } from "node:console";

@Service()
export class TransferService {
  private transferRepo = AppDataSource.getRepository(Transfer);
  private admissionRepo = AppDataSource.getRepository(Admission);
  private bedRepo = AppDataSource.getRepository(Bed);
  private patientRepo = AppDataSource.getRepository(Patient);
  private userRepo = AppDataSource.getRepository(User);

  public async createtransferRequest(
    patientId: number,
    toBedId: number,
    userId: number,
  ) {
    const patient = await this.patientRepo.findOne({
      where: { id: patientId },
    });

    if (!patient) {
      throw new Error("Patient not found");
    }

    const admission = await this.admissionRepo.findOne({
      where: {
        patient: { id: patientId },
        status: AdmissionStatus.ACTIVE,
      },
      relations: ["bed", "bed.ward"],
    });

    if (!admission) {
      throw new Error("No Active Admission Found");
    }

    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ["ward"],
    });

    if (!user) {
      throw new Error("User Not Found");
    }

    if (user.role === UserRole.STAFF) {
      if (!user.ward || user.ward.id !== admission.bed.ward.id) {
        throw new Error(
          "Access Denied - cannot transfer patient from another ward ",
        );
      }
    }

    const toBed = await this.bedRepo.findOne({
      where: { id: toBedId },
      relations: ["ward"],
    });

    if (!toBed) {
      throw new Error("Destination bed not found");
    }

    if (admission.bed.id === toBed.id) {
      throw new Error("Patient is already assigned to this bed");
    }

    if (toBed.status !== BedStatus.AVAILABLE) {
      throw new Error("Destination bed is not available");
    }

    const existingTransfer = await this.transferRepo.findOne({
      where: {
        patient: { id: patientId },
        status: TransferStatus.PENDING,
      },
    });

    if (existingTransfer) {
      throw new Error("Pending transfer already exists");
    }

    const transfer = this.transferRepo.create({
      patient,
      from_bed: admission.bed,
      to_bed: toBed,
      requested_by: user,
      status: TransferStatus.PENDING,
    });

    await this.transferRepo.save(transfer);

    return transfer;
  }

  public async getPendingTransfers(userId: number) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (user.role !== UserRole.SENIOR_STAFF) {
      throw new Error("Only Senior Staff can view pending transfers");
    }

    const transfers = await this.transferRepo.find({
      where: {
        status: TransferStatus.PENDING,
      },

      relations: [
        "patient",
        "from_bed",
        "from_bed.ward",
        "to_bed",
        "to_bed.ward",
        "requested_by",
      ],
      order:{
        requested_at:"DESC",
      },
    });
    return transfers;
  }
}
