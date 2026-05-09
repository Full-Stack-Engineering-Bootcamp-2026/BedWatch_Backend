import { Router } from "express";

import Container from "typedi";

import {
  AuthorizationMiddleware,
} from "../../auth/middleware/authorization.middleware";

import {
  AuthenticationMiddleware,
} from "../../auth/middleware/authenticate.middleware";

import {
  getStaffDashboardController,
  getAdmissionMetaController,
  createAdmissionController,
} from "../controller/user.staff.controller";

import { dischargePatientController } from "../controller/user.staff.controller";

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
  "/dashboard",

  authenticationMiddleware.use,

  authorizationMiddleware.allowRoles(
    "STAFF"
  ),

  getStaffDashboardController
);

router.get(
  "/admission-meta",

  authenticationMiddleware.use,

  authorizationMiddleware.allowRoles(
    "STAFF"
  ),

  getAdmissionMetaController
);

router.post(
  "/admissions",

  authenticationMiddleware.use,

  authorizationMiddleware.allowRoles(
    "STAFF"
  ),

  createAdmissionController
);

router.patch(
  "/beds/:id/discharge",

  authenticationMiddleware.use,

  authorizationMiddleware.allowRoles(
    "STAFF"
  ),

  dischargePatientController
);



export default router;