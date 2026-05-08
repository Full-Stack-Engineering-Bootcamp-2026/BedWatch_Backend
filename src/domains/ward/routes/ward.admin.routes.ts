import { Router } from "express";

import { Service } from "typedi";

import { WardAdminController } from "../controller/ward.admin.controller";

@Service()
export class WardAdminRoutes {
  public router: Router;

  constructor(private wardAdminController: WardAdminController) {
    this.router = Router();

    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get("/summary", this.wardAdminController.getWardSummary);
    this.router.get("/:id/beds", this.wardAdminController.getBedsByWardId);
    this.router.get("/", this.wardAdminController.getAllWards);
    this.router.put("/:id", this.wardAdminController.updateWard);
    this.router.delete("/:id", this.wardAdminController.deleteWard);
  }
}
