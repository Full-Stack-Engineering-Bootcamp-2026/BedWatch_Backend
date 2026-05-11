import { Service } from "typedi";
import  AppDataSource  from "../../../db/data-source";
import { Ward } from "../entity/ward.entity";
import { Bed } from "../../bed/entity/bed.entity";
import { log } from "node:console";
import { success } from "../../../Http_Response/response";

@Service()
export class WardService {
  private wardRepo = AppDataSource.getRepository(Ward);
  private bedRepo = AppDataSource.getRepository(Bed);

  public async getAllWards() {
    const wards = await this.wardRepo.find();

    return wards;
  }

  public async getWardSummary() {
    const wards = await this.wardRepo.find({
      relations: ["beds"],
    });

    // console.log(wards);

    const data = wards.map((ward) => {
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

    return data;
  }

  public async createWard(
    name: string,
    type: string,
    capacity: number,
    description?: string,
  ) {
    const existing = await this.wardRepo.findOne({
      where: { name },
    });

    if (existing) {
      return {
        success: false,
        message: "Ward already exists",
        data: null,
      };
    }

    const ward = this.wardRepo.create({
      name,
      type,
      capacity,
      description: description ?? null,
    });

    await this.wardRepo.save(ward);

    const beds: Bed[] = [];

    for (let i = 1; i <= capacity; i++) {
      const bed = this.bedRepo.create({
        ward,
        bed_number: `${name}-${i}`,
      });

      beds.push(bed);
    }

    await this.bedRepo.save(beds);

    return {
      success: true,
      message: "Ward created successfully",
      data: ward,
    };
  }
}
