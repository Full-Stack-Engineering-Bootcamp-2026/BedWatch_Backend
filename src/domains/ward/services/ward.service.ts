import { Service } from "typedi";
import { AppDataSource } from "../../../db/db";
import { Ward } from "../entity/ward.entity";
import { Bed } from "../../bed/entity/bed.entity";

@Service()
export class WardService {
  private wardRepo = AppDataSource.getRepository(Ward);
  private bedRepo = AppDataSource.getRepository(Bed);

  public async getAllWards() {
    const wards = await this.wardRepo.find({
      relations: ["beds", "users"],
    });

    return wards;
  }

  public async createWard(
    name: string,
    type: string,
    capacity: number,
    description?: string,
  ) {
    const existing = await this.wardRepo.findOne({ where: { name } });
    if (existing) {
      throw new Error("Ward already exists");
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

    return ward;
  }
}
