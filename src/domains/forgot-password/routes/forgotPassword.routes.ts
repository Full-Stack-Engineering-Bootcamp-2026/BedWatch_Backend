import { Router } from "express";

import { Service } from "typedi";

import { ForgotPasswordController } from "../controller/forgotPassword.controller";

@Service()
export class ForgotPasswordRoutes {
  public router: Router;

  constructor(private forgotPasswordController: ForgotPasswordController) {
    this.router = Router();

    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      "/forgot-password",
      this.forgotPasswordController.forgotPassword,
    );

    this.router.post(
      "/reset-password",
      this.forgotPasswordController.resetPassword,
    );
    this.router.post(
      "/send-account-setup-email",
      this.forgotPasswordController.sendAccountSetupEmail,
    );
  }
}
