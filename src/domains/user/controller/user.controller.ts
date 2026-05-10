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

  private storageService: StorageService
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

  public uploadProfileImage = async (
  req: Request,
  res: Response
) => {
  try {

    if (!req.file) {
      return res
        .status(400)
        .json(
          failure(
            "Image file is required"
          )
        );
    }

    const fileName =
      `profile/${Date.now()}-${req.file.originalname}`;

    await this.storageService.uploadFile(
      req.file,
      fileName
    );

    const imageUrl =
      console.log(req.file);
      await this.storageService.getSignedFileUrl(
        fileName
      );

    return res
      .status(200)
      .json(
        success(
          {
            fileName,
            imageUrl,
          },
          "Profile image uploaded successfully"
        )
      );

  } catch (error: any) {

    return res
      .status(400)
      .json(
        failure(
          error.message ||
          "Failed to upload profile image"
        )
      );
  }
};
}
