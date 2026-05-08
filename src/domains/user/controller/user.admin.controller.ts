import { Request, Response } from "express";
import { Service } from "typedi";

import { UserService } from "../service/user.admin.service";

import { success, failure } from "../../../Http_Response/response";

@Service()
export class UserController {
  constructor(private userService: UserService) {}

  public getAllStaff = async (req: Request, res: Response): Promise<void> => {
    try {
      const staff = await this.userService.getAllStaff();

      res.status(200).json(success(staff, "All staff fetched successfully"));
    } catch (error: any) {
      console.log(error);

      res
        .status(500)
        .json(failure(error.message || "Failed to fetch staff", error));
    }
  };

  public changePassword = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const { id: userId, oldPassword, newPassword } = req.body;

      const response = await this.userService.changePassword({
        userId,
        oldPassword,
        newPassword,
      });

      res.status(200).json(success(response, "Password changed successfully"));
    } catch (error: any) {
      console.log(error);

      res
        .status(500)
        .json(failure(error.message || "Failed to change password", error));
    }
  };
}
