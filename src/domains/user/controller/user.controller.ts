import { Request, Response } from "express";

import { Service } from "typedi";

import { UserService } from "../service/user.service";

import { success, failure } from "../../../Http_Response/response";

import { StorageService } from "../../../common/storage/storageService";

@Service()
export class UserController {
  // constructor(private userService: UserService) {}

  constructor(
    private userService: UserService,

    private storageService: StorageService,
  ) {}

  public createUser = async (req: Request, res: Response) => {
    try {
      const { name, email, password, role, wardId } = req.body;

      const user = await this.userService.createUser({
        name,
        email,
        password,
        role,
        wardId,
      });

      return res.status(201).json(success(user, "User created successfully"));
    } catch (error: any) {
      return res
        .status(400)
        .json(failure(error.message || "Failed to create user"));
    }
  };

  public getMe = async (req: Request, res: Response) => {
    try {
      const userId = Number(req.user?.id);

      const user = await this.userService.getLoggedInUser(userId);

      return res
        .status(200)
        .json(success(user, "Logged in user fetched successfully"));
    } catch (error: any) {
      return res
        .status(400)
        .json(failure(error.message || "Failed to fetch logged in user"));
    }
  };

  //image upload service

  public uploadProfileImage = async (req: Request, res: Response) => {
    try {
      const userId = Number(req.user?.id);

      if (!userId) {
        return res.status(401).json(failure("Unauthorized user"));
      }

      if (!req.file) {
        return res.status(400).json(failure("Image file is required"));
      }
      console.log("???????????????????????????????????", req.user);
      const imageUrl = await this.userService.uploadProfileImage(
        userId,
        req.file,
      );

      return res
        .status(200)
        .json(success(imageUrl, "Profile image uploaded successfully"));
    } catch (error: any) {
      console.log("UPLOAD ERROR:", error);

      console.log("UPLOAD ERROR MESSAGE:", error?.message);

      console.log("UPLOAD ERROR STACK:", error?.stack);

      return res
        .status(400)
        .json(failure(error?.message || "Failed to upload profile image"));
    }
  };
}
