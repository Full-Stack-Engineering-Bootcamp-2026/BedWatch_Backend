import { Service } from "typedi"
import { Router } from "express"
import Container from "typedi"
import { AuthorizationMiddleware } from "../../auth/middleware/authorization.middleware";
import { AuthenticationMiddleware} from "../../auth/middleware/authenticate.middleware";
import { getStaffDashboardController, getAdmissionController,createAdmissionController,dischargePatientController} from "../controller/user.staff.controller";

@Service()
export class StaffRoutes {
  public router: Router;

  private authenticationMiddleware = Container.get(AuthenticationMiddleware);

  private authorizationMiddleware = Container.get(AuthorizationMiddleware);

  constructor() {
    this.router = Router();

    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      "/dashboard",

      this.authenticationMiddleware.use,

      this.authorizationMiddleware.allowRoles(
        "STAFF"
      ),

      getStaffDashboardController
    );

    this.router.get(
      "/admission-meta",

      this.authenticationMiddleware.use,

      this.authorizationMiddleware.allowRoles(
        "STAFF"
      ),

      getAdmissionController
    );

    this.router.post(
      "/admissions",

      this.authenticationMiddleware.use,

      this.authorizationMiddleware.allowRoles(
        "STAFF"
      ),

      createAdmissionController
    );

    this.router.patch(
      "/beds/:id/discharge",

      this.authenticationMiddleware.use,

      this.authorizationMiddleware.allowRoles(
        "STAFF"
      ),

      dischargePatientController
    );
  }
}