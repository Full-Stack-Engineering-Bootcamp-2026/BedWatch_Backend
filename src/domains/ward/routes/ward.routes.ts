import { Router } from "express";
import { Service } from "typedi";
import { WardController } from "../controller/ward.controller";

@Service()
export class WardRoutes {
  public router: Router;

  constructor(private wardController: WardController) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get("/", this.wardController.getAllWards);
    this.router.post("/create", this.wardController.createWard);
  }
}
