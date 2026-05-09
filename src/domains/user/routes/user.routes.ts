import { Router } from "express";

import { Service } from "typedi";

import { UserController } from "../controller/user.controller";

import { AuthenticationMiddleware } from "../../auth/middleware/authenticate.middleware";
@Service()
export class UserRoutes {
  public router: Router;

  constructor(
    private userController: UserController,
    private authMiddleware: AuthenticationMiddleware,
  ) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post("/", this.userController.createUser);

    this.router.get("/me", this.authMiddleware.use, this.userController.getMe);
  }
}
