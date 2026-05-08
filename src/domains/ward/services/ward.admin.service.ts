import { Service } from "typedi";

import AppDataSource from "../../../db/data-source";

import { Ward } from "../entity/ward.entity";
import { Bed } from "../../bed/entity/bed.entity";

@Service()
export class WardAdminService {
  private wardRepo = AppDataSource.getRepository(Ward);

  private bedRepo = AppDataSource.getRepository(Bed);

  public async getWardSummary() {
    const wards = await this.wardRepo.find({
      relations: ["beds"],
    });

    return wards.map((ward) => {
      const availableBeds = ward.beds.filter(
        (bed) => bed.status === "AVAILABLE",
      ).length;

      const occupiedBeds = ward.beds.filter(
        (bed) => bed.status === "OCCUPIED",
      ).length;

      const cleaningBeds = ward.beds.filter(
        (bed) => bed.status === "CLEANING",
      ).length;

      return {
        id: ward.id,
        name: ward.name,
        type: ward.type,
        capacity: ward.capacity,
        description: ward.description,

        availableBeds,
        occupiedBeds,
        cleaningBeds,
      };
    });
  }

  public async getBedsByWardId(wardId: number) {
    const beds = await this.bedRepo.find({
      where: {
        ward: {
          id: wardId,
        },
      },

      relations: ["ward"],

      order: {
        bed_number: "ASC",
      },
    });

    return beds;
  }

  public async getAllWards() {
    const wards = await this.wardRepo.find({
      relations: ["beds"],
      order: {
        created_at: "DESC",
      },
    });

    return wards.map((ward) => ({
      id: ward.id,
      name: ward.name,
      beds: ward.capacity,

      status: ward.beds.length > 0 ? "ACTIVE" : "INACTIVE",
    }));
  }
  public async updateWard(
    id: number,
    data: {
      name?: string;
      type?: string;
      capacity?: number;
      description?: string;
    },
  ) {
    const ward = await this.wardRepo.findOne({
      where: { id },
    });

    if (!ward) {
      throw new Error("Ward not found");
    }

    Object.assign(ward, data);

    await this.wardRepo.save(ward);

    return ward;
  }

  public async deleteWard(id: number) {
    const ward = await this.wardRepo.findOne({
      where: { id },
    });

    if (!ward) {
      throw new Error("Ward not found");
    }

    await this.wardRepo.remove(ward);

    return true;
  }
}
