import { Request, Response } from "express";
import { Service } from "typedi";

import { AuthService } from "../service/auth.service";
import { success, failure } from "../../../Http_Response/response";

@Service()
export class AuthController {
  constructor(private authService: AuthService) {}

  public createAdmin = async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res
          .status(400)
          .json(failure("Name, Email and Password are required"));
      }

      const admin = await this.authService.createAdmin(name, email, password);

      return res.status(201).json(
        success(
          {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
          },
          "Admin created successfully",
        ),
      );
    } catch (error: unknown) {
      return res
        .status(400)
        .json(
          failure(
            error instanceof Error ? error.message : "Failed to create admin",
          ),
        );
    }
  };

  public login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json(failure("Email and Password Required"));
      }

      const result = await this.authService.login(email, password);

      if (!result) {
        return res.status(401).json(failure("Incorrect Email or Password"));
      }

      const { token, user } = result;

      return res.status(200).json(
        success(
          {
            token,
            user: {
              id: user.id,
              email: user.email,
              role: user.role,
            },
          },
          "Login Successful",
        ),
      );
    } catch (error: unknown) {
      return res
        .status(500)
        .json(failure(error instanceof Error ? error.message : "Login Failed"));
    }
  };
}
