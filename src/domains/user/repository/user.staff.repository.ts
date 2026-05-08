import AppDataSource  from "../../../db/data-source";

import { User } from "../../user/entity/user.entity";

import { Bed } from "../../bed/entity/bed.entity";

export const getStaffDashboardRepository =
  async (userId: number) => {
    const userRepo =
      AppDataSource.getRepository(User);

    const bedRepo =
      AppDataSource.getRepository(Bed);

    const user =
      await userRepo.findOne({
        where: { id: userId },
        relations: ["ward"],
      });

    if (!user || !user.ward) {
      throw new Error(
        "Ward not assigned"
      );
    }

    const beds =
      await bedRepo.find({
        where: {
          ward: {
            id: user.ward.id,
          },
        },
      });

    return {
      ward: user.ward,
      beds,
    };
  };