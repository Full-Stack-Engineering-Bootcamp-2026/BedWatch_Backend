import { Service } from "typedi";

import AppDataSource from "../../../db/data-source";

import {
  Bed,
  BedStatus,
} from "../entity/bed.entity";

@Service()
export class BedService {
  private bedRepository =
    AppDataSource.getRepository(Bed);

  public async getAvailableBedsByWard(
    wardId: number,
  ) {
    const beds =
      await this.bedRepository.find({
        where: {
          ward: { id: wardId },
          status:
            BedStatus.AVAILABLE,
        },

        relations: ["ward"],

        order: {
          bed_number: "ASC",
        },
      });

    return beds;
  }
}