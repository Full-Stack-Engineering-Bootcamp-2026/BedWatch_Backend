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
import { BedStatusLog } from "../../bedStatusLogger/entity/bedStatusLog.entity";

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
      order: {
        requested_at: "DESC",
      },
    });
    return transfers;
  }

  public async approveTransfer(transferId: number, userId: number) {
    return await AppDataSource.transaction(async (manager) => {
      const transferRepo = manager.getRepository(Transfer);
      const admissionRepo = manager.getRepository(Admission);
      const bedRepo = manager.getRepository(Bed);
      const userRepo = manager.getRepository(User);

      const bedStatusLogRepo = manager.getRepository(BedStatusLog);

      const approver = await userRepo.findOne({
        where: { id: userId },
      });

      if (!approver) {
        throw new Error("User not found");
      }

      if (approver.role !== UserRole.SENIOR_STAFF) {
        throw new Error("Only senior staff can approve transfers");
      }

      const transfer = await transferRepo.findOne({
        where: { id: transferId },
        relations: ["patient", "from_bed", "to_bed"],
      });

      if (!transfer) {
        throw new Error("Transfer not found");
      }

      if (transfer.status !== TransferStatus.PENDING) {
        throw new Error("Transfer already processed");
      }

    if (!transfer.to_bed) {
  throw new Error(
    "Destination bed not assigned",
  );
}

if (
  transfer.to_bed.status !==
  BedStatus.AVAILABLE
) {
  throw new Error(
    "Destination bed is not available",
  );
}
      const admission = await admissionRepo.findOne({
        where: {
          patient: { id: transfer.patient.id },
          status: AdmissionStatus.ACTIVE,
        },
        relations: ["bed"],
      });

      if (!admission) {
        throw new Error("Active admission not found");
      }
      transfer.from_bed.status = BedStatus.CLEANING;
      transfer.to_bed.status = BedStatus.OCCUPIED;
      await bedRepo.save(transfer.from_bed);
      await bedRepo.save(transfer.to_bed);

      admission.bed = transfer.to_bed;
      await admissionRepo.save(admission);

      transfer.status = TransferStatus.APPROVED;
      transfer.approved_by = approver;
      transfer.completed_at = new Date();
      await transferRepo.save(transfer);

      const oldBedLog = bedStatusLogRepo.create({
        bed: transfer.from_bed,
        changed_by: approver,
        status: BedStatus.CLEANING,
      });

      const newBedLog = bedStatusLogRepo.create({
        bed: transfer.to_bed,
        changed_by: approver,
        status: BedStatus.OCCUPIED,
      });

      await bedStatusLogRepo.save(oldBedLog);
      await bedStatusLogRepo.save(newBedLog);

      return transfer;
    });
  }

  public async rejectTranfer(transferId: number, userId: number) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (user.role !== UserRole.SENIOR_STAFF) {
      throw new Error("Only senior staff can reject transfers");
    }

    const transfer = await this.transferRepo.findOne({
      where: { id: transferId },
    });
    if (!transfer) {
      throw new Error("Transfer not found");
    }
    if (transfer.status !== TransferStatus.PENDING) {
      throw new Error("Transfer already processed");
    }
    transfer.status = TransferStatus.REJECTED;
    transfer.approved_by = user;
    transfer.completed_at = new Date();
    await this.transferRepo.save(transfer);
    return transfer;
  }

  public async getAllTransfers() {
  return await this.transferRepo.find({
    relations: [
      "patient",
      "from_bed",
      "from_bed.ward",
      "to_bed",
      "to_bed.ward",
      "requested_by",
      "approved_by",
    ],
    order: {
      requested_at: "DESC",
    },
  });

  
}

public async getCompletedTransfers() {
  return await this.transferRepo.find({
    where: {
      status: TransferStatus.COMPLETED,
    },

    relations: [
      "from_bed",
      "from_bed.ward",
      "to_bed",
      "to_bed.ward",
      "requested_by",
      "approved_by",
    ],

    order: {
      requested_at: "DESC",
    },
  });
}

public async getRejectedTransfers() {
  return await this.transferRepo.find({
    where: {
      status: TransferStatus.REJECTED,
    },

    relations: [
      "patient",
      "from_bed",
      "from_bed.ward",
      "to_bed",
      "to_bed.ward",
      "requested_by",
      "approved_by",
    ],

    order: {
      requested_at: "DESC",

    },
  });
}


}
