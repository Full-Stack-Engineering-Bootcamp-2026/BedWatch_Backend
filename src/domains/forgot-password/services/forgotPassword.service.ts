import AppDataSource from "../../../db/data-source";
import { sendAccountCreatedEmail } from "../utils/sendEmailStaff";
import { ForgotPassword } from "../entity/forgotPassword.entity";

import { User } from "../../user/entity/user.entity";

import bcrypt from "bcrypt";

import crypto from "crypto";
import { sendResetEmail } from "../utils/sendMail";
import { Service } from "typedi";

@Service()
export class ForgotPasswordService {
  private forgotPasswordRepository =
    AppDataSource.getRepository(ForgotPassword);

  private userRepository = AppDataSource.getRepository(User);

  public forgotPassword = async (email: string) => {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const token = crypto.randomBytes(32).toString("hex");

    const forgotPassword = this.forgotPasswordRepository.create({
      email,
      token,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    });

    await this.forgotPasswordRepository.save(forgotPassword);

    await sendResetEmail(email, token);

    return {
      success: true,
      message: "Check Your Email!!",
    };
  };

  public resetPassword = async (token: string, password: string) => {
    const resetData = await this.forgotPasswordRepository.findOne({
      where: { token },
    });

    if (!resetData) {
      throw new Error("Invalid token");
    }

    if (new Date() > resetData.expiresAt) {
      throw new Error("Token expired");
    }

    const user = await this.userRepository.findOne({
      where: { email: resetData.email },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    await this.userRepository.save(user);

    await this.forgotPasswordRepository.delete({
      token,
    });

    return {
      success: true,
      message: "Password reset successful",
    };
  };

  public sendAccountSetupEmail = async (email: string, role: string) => {
    const token = crypto.randomBytes(32).toString("hex");

    const forgotPassword = this.forgotPasswordRepository.create({
      email,
      token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    await this.forgotPasswordRepository.save(forgotPassword);

    await sendAccountCreatedEmail(email, token, role);

    return {
      success: true,
      message: "Account setup email sent",
    };
  };
}
