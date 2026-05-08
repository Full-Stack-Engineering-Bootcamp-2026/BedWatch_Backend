import AppDataSource from "../../../db/data-source";
import bcrypt from "bcrypt";
import { User, UserRole } from "../entity/user.entity";

import { Ward } from "../../ward/entity/ward.entity";
import { Service } from "typedi";

@Service()
export class UserService {
  private userRepository = AppDataSource.getRepository(User);
  public async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
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
    const hashedPassword = await this.hashPassword(data.password);

    const user = this.userRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role,
      ward,
    });

    await this.userRepository.save(user);

    return user;
  };

  public getLoggedInUser = async (userId: number) => {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: ["ward"],
    });

    if (!user) {
      throw new Error("User not found");
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
  };
}
