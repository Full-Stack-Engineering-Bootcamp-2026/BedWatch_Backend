import AppDataSource from "../../../db/data-source";
import { User } from "../entity/user.entity";

export const uploadProfileImageRepository =
  async (
    userId: number,
    imageUrl: string
  ) => {

    const userRepository =
      AppDataSource.getRepository(
        User
      );

    const user =
      await userRepository.findOne({
        where: {
          id: userId,
        },
      });

    if (!user) {

      throw new Error(
        "User not found"
      );
    }

    user.imageUrl =
      imageUrl;

    await userRepository.save(
      user
    );

    return user;
  };