import { Service } from "typedi";
import AppDataSource from "../../../db/data-source";
import {Transfer,TransferStatus} from "../entity/transfer.entity";
import { Patient } from "../../patient/entity/patient.entity";
import { Bed } from "../../bed/entity/bed.entity";
import { User } from "../../user/entity/user.entity";
import {Admission,AdmissionStatus} from "../../admission/entity/admission.entity";
import { CreateTransferDto } from "../dto/transfer.dto";

@Service()
export class StaffTransferService {
  private transferRepo =
    AppDataSource.getRepository(
      Transfer,
    );

  private patientRepo =
    AppDataSource.getRepository(
      Patient,
    );

  private bedRepo =
    AppDataSource.getRepository(
      Bed,
    );

  private userRepo =
    AppDataSource.getRepository(
      User,
    );

  private admissionRepo =
    AppDataSource.getRepository(
      Admission,
    );

  public async createTransferRequest(
  payload: CreateTransferDto,
  userId: number,
) {

  const {
    patientId,
    fromBedNumber,
    toBedNumber,
  } = payload;

  const patient =
    await this.patientRepo.findOne({
      where: {
        id: patientId,
      },
    });

  if (!patient) {

    throw new Error(
      "Patient not found",
    );

  }

  const activeAdmission =
    await this.admissionRepo.findOne({
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
    });

  if (!activeAdmission) {

    throw new Error(
      "Patient does not have active admission",
    );

  }

  const fromBed =
    await this.bedRepo.findOne({
      where: {
        bed_number:
          fromBedNumber,
      },

      relations: [
        "ward",
      ],
    });

  if (!fromBed) {

    throw new Error(
      "From bed not found",
    );

  }

  const toBed =
    await this.bedRepo.findOne({
      where: {
        bed_number:
          toBedNumber,
      },

      relations: [
        "ward",
      ],
    });

  if (!toBed) {

    throw new Error(
      "Destination bed not found",
    );

  }

  if (
    toBed.status !==
    "AVAILABLE"
  ) {

    throw new Error(
      "Selected bed is not available",
    );

  }

  if (
    fromBed.id ===
    toBed.id
  ) {

    throw new Error(
      "Cannot transfer to same bed",
    );

  }

  const existingTransfer =
    await this.transferRepo.findOne({
      where: {
        patient: {
          id: patientId,
        },

        status:
          TransferStatus.PENDING,
      },
    });

  if (existingTransfer) {

    throw new Error(
      "Pending transfer already exists",
    );

  }

  const user =
    await this.userRepo.findOne({
      where: {
        id: userId,
      },
    });

  if (!user) {

    throw new Error(
      "User not found",
    );

  }

  const transfer =
    this.transferRepo.create({
      patient,

      from_bed:
        fromBed,

      to_bed:
        toBed,

      requested_by:
        user,

      approved_by:
        null,

      status:
        TransferStatus.PENDING,

      completed_at:
        null,
    });

  await this.transferRepo.save(
    transfer,
  );

  return transfer;
}

  public async getMyTransferRequests(
    userId: number,
  ) {
    const transfers =
      await this.transferRepo.find({
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
      });

    return transfers;
  }
}