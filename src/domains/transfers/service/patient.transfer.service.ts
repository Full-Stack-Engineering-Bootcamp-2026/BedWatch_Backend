import { Service } from "typedi";

import AppDataSource from "../../../db/data-source";

import {
  Transfer,
  TransferStatus,
} from "../entity/transfer.entity";

import { Patient } from "../../patient/entity/patient.entity";

import { Bed } from "../../bed/entity/bed.entity";

import { User } from "../../user/entity/user.entity";

import {
  Admission,
  AdmissionStatus,
} from "../../admission/entity/admission.entity";

import { CreateTransferDto } from "../dto/transfer.dto";

@Service()
export class StaffTransferService {
  private transferRepository =
    AppDataSource.getRepository(
      Transfer,
    );

  private patientRepository =
    AppDataSource.getRepository(
      Patient,
    );

  private bedRepository =
    AppDataSource.getRepository(
      Bed,
    );

  private userRepository =
    AppDataSource.getRepository(
      User,
    );

  private admissionRepository =
    AppDataSource.getRepository(
      Admission,
    );

  public async createTransferRequest(
    payload: CreateTransferDto,
    userId: number,
  ) {
    const {
      patientId,
      currentBedId,
      currentWardId,
      destinationWardId,
    } = payload;

    const patient =
      await this.patientRepository.findOne(
        {
          where: { id: patientId },
        },
      );

    if (!patient) {
      throw new Error(
        "Patient not found",
      );
    }

    const activeAdmission =
      await this.admissionRepository.findOne(
        {
          where: {
            patient: {
              id: patientId,
            },

            status:
              AdmissionStatus.ACTIVE,
          },

          relations: [
            "patient",
            "bed",
            "bed.ward",
          ],
        },
      );

    if (!activeAdmission) {
      throw new Error(
        "Patient does not have an active admission",
      );
    }

    const fromBed =
      await this.bedRepository.findOne(
        {
          where: {
            id: currentBedId,
          },

          relations: ["ward"],
        },
      );

    if (!fromBed) {
      throw new Error(
        "Current bed not found",
      );
    }

    if (
      fromBed.ward.id !==
      currentWardId
    ) {
      throw new Error(
        "Current ward does not match current bed",
      );
    }

    if (
      currentWardId ===
      destinationWardId
    ) {
      throw new Error(
        "Destination ward must be different",
      );
    }

    const existingTransfer =
      await this.transferRepository.findOne(
        {
          where: {
            patient: {
              id: patientId,
            },

            status:
              TransferStatus.PENDING,
          },
        },
      );

    if (existingTransfer) {
      throw new Error(
        "Pending transfer request already exists",
      );
    }

    const user =
      await this.userRepository.findOne(
        {
          where: { id: userId },
        },
      );

    if (!user) {
      throw new Error(
        "User not found",
      );
    }

    const transfer =
      this.transferRepository.create(
        {
          patient,

          from_bed: fromBed,

          to_bed: null,

          requested_by: user,

          status:
            TransferStatus.PENDING,
        },
      );

    await this.transferRepository.save(
      transfer,
    );

    return {
      transfer,
      destinationWardId,
    };
  }

  public async getMyTransferRequests(
    userId: number,
  ) {
    const transfers =
      await this.transferRepository.find(
        {
          where: {
            requested_by: {
              id: userId,
            },
          },

          relations: [
            "patient",
            "from_bed",
            "from_bed.ward",
            "to_bed",
            "requested_by",
            "approved_by",
          ],

          order: {
            requested_at: "DESC",
          },
        },
      );

    return transfers;
  }
}