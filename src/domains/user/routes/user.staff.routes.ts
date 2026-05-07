import { Router } from "express";
import Container from "typedi";

import { AuthorizationMiddleware } from "../../auth/middleware/authorization.middleware";

import { getStaffDashboardController } from "../controller/user.staff.controller";
import { AuthenticationMiddleware } from "../../auth/middleware/authenticate.middleware";

const router = Router();

const authenticationMiddleware =
  Container.get(
    AuthenticationMiddleware
  );

const authorizationMiddleware =
  Container.get(
    AuthorizationMiddleware
  );

router.get(
  "/dashboard/:id",

//   authenticationMiddleware.use,

//   authorizationMiddleware.allowRoles(
//     "STAFF"
//   ),

  getStaffDashboardController
);

export default router;