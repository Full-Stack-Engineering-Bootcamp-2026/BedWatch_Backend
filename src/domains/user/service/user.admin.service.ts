import { Service } from "typedi";
import AppDataSource from "../../../db/data-source";
import { User, UserRole } from "../entity/user.entity";
import { Not } from "typeorm";
import bcrypt from "bcrypt";

@Service()
export class UserService {
  private userRepository = AppDataSource.getRepository(User);

  public getAllStaff = async () => {
    const staff = await this.userRepository.find({
      where: {
        role: Not(UserRole.ADMIN),
      },
      relations: ["ward"],
    });

    return staff;
  };

  public changePassword = async (data: {
    userId: number;
    oldPassword: string;
    newPassword: string;
  }) => {
    const { userId, oldPassword, newPassword } = data;

    if (!oldPassword || !newPassword) {
      throw new Error("All fields are required");
    }

    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordMatch) {
      throw new Error("Old password is incorrect");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    await this.userRepository.save(user);

    return user;
  };
}
