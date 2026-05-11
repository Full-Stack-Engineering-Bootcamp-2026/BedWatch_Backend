import { Router } from "express";

import Container, {
  Service,
} from "typedi";

import { BedController } from "../controller/bed.controller";

import { AuthenticationMiddleware } from "../../auth/middleware/authenticate.middleware";

@Service()
export class BedRoutes {
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    const controller =
      Container.get(BedController);

    const authMiddleware =
      Container.get(
        AuthenticationMiddleware
      );

    this.router.get(
      "/available",
      authMiddleware.use,
      controller.getAvailableBedsByWard,
    );
  }
} 