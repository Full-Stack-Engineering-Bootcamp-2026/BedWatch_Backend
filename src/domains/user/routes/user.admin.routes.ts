import { Router } from "express";

import { Service } from "typedi";

import { UserController } from "../controller/user.admin.controller";

@Service()
export class UserAdminRoutes {
  public router: Router;

  constructor(private userController: UserController) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get("/allstaff", this.userController.getAllStaff);
    this.router.put("/change-password", this.userController.changePassword);
  }
}
