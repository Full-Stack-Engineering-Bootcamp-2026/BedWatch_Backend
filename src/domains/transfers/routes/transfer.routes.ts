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

    this.router.patch(
      "/:id/approve",
      authMiddleware.use,
      controller.approveTransfer,
    );

    this.router.patch(
      "/:id/reject",
      authMiddleware.use,
      controller.rejectTransfer,
    );

    this.router.get("/table", authMiddleware.use, controller.getTransfersTable);

    this.router.get("/all", authMiddleware.use, controller.getAllTransfers);

    this.router.get(
      "/completed",
      authMiddleware.use,
      controller.getCompletedTransfers,
    );

    this.router.get(
      "/rejected",
      authMiddleware.use,
      controller.getRejectedTransfers,
    );
  }
}
