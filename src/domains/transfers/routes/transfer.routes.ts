import { Router } from "express";
import Container, { Service } from "typedi";

import { AuthenticationMiddleware } from "../../auth/middleware/authenticate.middleware";
import { TransferController } from "../controller/transfer.controller";

@Service()
export class TransferRoutes {
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    const controller = Container.get(TransferController);

    const authMiddleware = Container.get(AuthenticationMiddleware);

    this.router.post("/", authMiddleware.use, controller.createTransferRequest);

    this.router.get(
      "/pending",
      authMiddleware.use,
      controller.getPendingTransfers,
    );
  }
}
