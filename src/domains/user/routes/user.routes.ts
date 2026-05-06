import { Router } from "express";

import { Service } from "typedi";

import { UserController } from "../controller/user.controller";

@Service()
export class UserRoutes {
  public router: Router;

  constructor(private userController: UserController) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post("/", this.userController.createUser);
  }
}
