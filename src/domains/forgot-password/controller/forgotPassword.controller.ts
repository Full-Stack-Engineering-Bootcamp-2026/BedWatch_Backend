import { Request, Response } from "express";

import { Service } from "typedi";

import { ForgotPasswordService } from "../services/forgotPassword.service";

import { success, failure } from "../../../Http_Response/response";

@Service()
export class ForgotPasswordController {
  constructor(private forgotPasswordService: ForgotPasswordService) {}

  public forgotPassword = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      const response = await this.forgotPasswordService.forgotPassword(email);

      return res
        .status(200)
        .json(success(response, "Reset token generated successfully"));
    } catch (error: any) {
      return res
        .status(400)
        .json(failure(error.message || "Forgot password failed", error));
    }
  };

  public resetPassword = async (req: Request, res: Response) => {
    try {
      const { token, password } = req.body;

      console.log("token : ", token);

      const response = await this.forgotPasswordService.resetPassword(
        token,
        password,
      );

      return res
        .status(200)
        .json(success(response, "Password reset successful"));
    } catch (error: any) {
      return res
        .status(400)
        .json(failure(error.message || "Reset password failed", error));
    }
  };

  public sendAccountSetupEmail = async (req: Request, res: Response) => {
    try {
      const { email, role } = req.body;

      const response = await this.forgotPasswordService.sendAccountSetupEmail(
        email,
        role,
      );

      return res
        .status(200)
        .json(success(response, "Account setup email sent"));
    } catch (error: any) {
      return res
        .status(400)
        .json(failure(error.message || "Failed to send email"));
    }
  };
}
