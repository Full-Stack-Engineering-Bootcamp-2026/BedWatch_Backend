import { Router } from "express";
import Container, { Service } from "typedi";

import { SeniorStaffController } from "../controller/srStaff.controller";

import { AuthenticationMiddleware } from "../../auth/middleware/authenticate.middleware";

@Service()
export class SeniorStaffRoutes {
  public router = Router();
  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    const controller = Container.get(SeniorStaffController);
    const authMiddleware = Container.get(AuthenticationMiddleware);
    this.router.get(
      "/dashboard/summary",
      authMiddleware.use,
      controller.getDashboardSummary,
    );

    this.router.get(
      "/dashboard/ward-occupancy",
      authMiddleware.use,
      controller.getWardOccupancy,
    );

    this.router.get(
      "/dashboard/alerts",
      authMiddleware.use,
      controller.getSystemAlerts,
    );

    this.router.get(
      "/dashboard/trends",
      authMiddleware.use,
      controller.getDashboardTrends,
    );
  }
}
