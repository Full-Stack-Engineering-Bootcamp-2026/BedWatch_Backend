import { Service } from "typedi";
import AppDataSource from "../../../db/data-source";
import { Bed, BedStatus } from "../../bed/entity/bed.entity";
import { Ward } from "../../ward/entity/ward.entity";
import { User, UserRole } from "../../user/entity/user.entity";
import {
  Transfer,
  TransferStatus,
} from "../../transfers/entity/transfer.entity";
import { Between } from "typeorm";
import {
  Admission,
  AdmissionStatus,
} from "../../admission/entity/admission.entity";

@Service()
export class SeniorStaffService {
  private bedRepo = AppDataSource.getRepository(Bed);
  private wardRepo = AppDataSource.getRepository(Ward);
  private transferRepo = AppDataSource.getRepository(Transfer);
  private admissionRepo = AppDataSource.getRepository(Admission);
  private userRepo = AppDataSource.getRepository(User);

  public async getDashboardSummary() {
    const totalBeds = await this.bedRepo.count();
    const occupied = await this.bedRepo.count({
      where: {
        status: BedStatus.OCCUPIED,
      },
    });
    const available = await this.bedRepo.count({
      where: {
        status: BedStatus.AVAILABLE,
      },
    });
    const cleaning = await this.bedRepo.count({
      where: {
        status: BedStatus.CLEANING,
      },
    });
    const load =
      totalBeds === 0 ? 0 : Number(((occupied / totalBeds) * 100).toFixed(1));
    return {
      totalBeds,
      occupied,
      available,
      cleaning,
      load,
    };
  }

  public async getWardOccupancy() {
    const wards = await this.wardRepo.find({
      relations: ["beds"],
    });
    const formattedWards = wards.map((ward) => {
      const occupied = ward.beds.filter(
        (bed) => bed.status === BedStatus.OCCUPIED,
      ).length;
      const available = ward.beds.filter(
        (bed) => bed.status === BedStatus.AVAILABLE,
      ).length;
      const cleaning = ward.beds.filter(
        (bed) => bed.status === BedStatus.CLEANING,
      ).length;
      const occupancyRate =
        ward.capacity === 0
          ? 0
          : Number(((occupied / ward.capacity) * 100).toFixed(1));
      let status = "NORMAL";
      if (occupancyRate >= 90) {
        status = "HIGH_STRAIN";
      } else if (occupancyRate >= 75) {
        status = "ELEVATED";
      }
      return {
        wardId: ward.id,
        wardName: ward.name,
        capacity: ward.capacity,
        occupied,
        available,
        cleaning,
        occupancyRate,
        status,
      };
    });
    return formattedWards;
  }

  public async getSystemAlerts() {
    const alerts: any[] = [];
    const wards = await this.wardRepo.find({
      relations: ["beds"],
    });
    for (const ward of wards) {
      const occupied = ward.beds.filter(
        (bed) => bed.status === BedStatus.OCCUPIED,
      ).length;
      const cleaning = ward.beds.filter(
        (bed) => bed.status === BedStatus.CLEANING,
      ).length;
      const occupancyRate =
        ward.capacity === 0 ? 0 : (occupied / ward.capacity) * 100;
      if (occupancyRate >= 90) {
        alerts.push({
          type: "CRITICAL",
          title: ward.name,
          message: `${occupancyRate.toFixed(0)}% capacity reached`,
          time: "Live",
        });
      }
      if (cleaning >= Math.ceil(ward.capacity * 0.2)) {
        alerts.push({
          type: "WARNING",
          title: ward.name,
          message: `${cleaning} beds under cleaning`,
          time: "Live",
        });
      }
    }
    const pendingTransfers = await this.transferRepo.count({
      where: {
        status: TransferStatus.PENDING,
      },
    });
    if (pendingTransfers >= 5) {
      alerts.push({
        type: "INFO",
        title: "Transfers",
        message: `${pendingTransfers} pending transfer requests`,
        time: "Live",
      });
    }
    return alerts;
  }

  public async getDashboardTrends() {
    const labels: string[] = [];
    const admissionsData: number[] = [];
    const dischargesData: number[] = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const currentDay = new Date();
      currentDay.setDate(today.getDate() - i);
      const startOfDay = new Date(currentDay);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(currentDay);
      endOfDay.setHours(23, 59, 59, 999);
      const admissions = await this.admissionRepo.count({
        where: {
          admitted_at: Between(startOfDay, endOfDay),
        },
      });
      const discharges = await this.admissionRepo.count({
        where: {
          discharged_at: Between(startOfDay, endOfDay),
          status: AdmissionStatus.DISCHARGED,
        },
      });
      labels.push(
        currentDay.toLocaleDateString("en-US", {
          weekday: "short",
        }),
      );
      admissionsData.push(admissions);
      dischargesData.push(discharges);
    }
    return {
      labels,
      admissions: admissionsData,
      discharges: dischargesData,
    };
  }

  public async getProfile(userId: number) {
    const user = await this.userRepo.findOne({
      where: {
        id: userId,
      },
      relations: ["ward"],
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (user.role !== UserRole.SENIOR_STAFF) {
      throw new Error("Only senior staff can access this profile");
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      ward: user.ward
        ? {
            id: user.ward.id,
            name: user.ward.name,
            type: user.ward.type,
            capacity: user.ward.capacity,
          }
        : null,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }

  
}
