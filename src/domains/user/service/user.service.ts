import { AppDataSource } from "../../../db/db";

import { User, UserRole } from "../entity/user.entity";

import { Ward } from "../../ward/entity/ward.entity";
import { Service } from "typedi";

@Service()
export class UserService {
  private userRepository = AppDataSource.getRepository(User);

  private wardRepository = AppDataSource.getRepository(Ward);

  public createUser = async (data: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    wardId?: number | null;
  }) => {
    const existingUser = await this.userRepository.findOne({
      where: {
        email: data.email,
      },
    });

    if (existingUser) {
      throw new Error("User already exists with this email");
    }

    let ward: Ward | null = null;

    if (data.role === UserRole.STAFF && data.wardId) {
      ward = await this.wardRepository.findOne({
        where: {
          id: data.wardId,
        },
      });

      if (!ward) {
        throw new Error("Ward not found");
      }
    }

    const user = this.userRepository.create({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
      ward,
    });

    await this.userRepository.save(user);

    return user;
  };
}
