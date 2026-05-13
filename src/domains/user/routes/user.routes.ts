import { Router } from "express";

import { Service } from "typedi";

import { UserController } from "../controller/user.controller";

import { AuthenticationMiddleware } from "../../auth/middleware/authenticate.middleware";

import { upload } from "../../../common/middlewares/upload.middleware";

@Service()
export class UserRoutes {
  public router: Router;

  constructor(
    private userController: UserController,

    private authMiddleware: AuthenticationMiddleware,
  ) {
    this.router = Router();

    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post("/", this.userController.createUser);

    this.router.get("/me", this.authMiddleware.use, this.userController.getMe);

    // upload image
    this.router.post(
      "/upload-profile",
      this.authMiddleware.use,

      upload.single("image"),

      this.userController.uploadProfileImage,
    );
  }
}
