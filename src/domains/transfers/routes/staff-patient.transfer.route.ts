import { Router } from "express";
import Container, { Service } from "typedi";

import { AuthenticationMiddleware } from "../../auth/middleware/authenticate.middleware";

import { StaffTransferController } from "../controller/staff.transfer.controller";

@Service()
export class StaffTransferRoutes {
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    const controller = Container.get(
      StaffTransferController,
    );

    const authMiddleware = Container.get(
      AuthenticationMiddleware,
    );

    this.router.post(
      "/",
      authMiddleware.use,
      controller.createTransferRequest,
    );

    this.router.get(
      "/my-requests",
      authMiddleware.use,
      controller.getMyTransferRequests,
    );
  }
}