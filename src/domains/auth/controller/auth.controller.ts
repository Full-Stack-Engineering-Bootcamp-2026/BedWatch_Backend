import { Request, Response } from "express";
import { Service } from "typedi";
import { AuthService } from "../service/auth.service";
import { success, failure } from "../../../Http_Response/response";

export class AuthController {
  constructor(private authService: AuthService) {}

  public login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json(failure("Email and Password Required"));
      }

      const { token, user } = await this.authService.login(email, password);

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
    } catch (error: any) {
      return res.status(401).json(failure(error.message || "login failed"));
    }
  };
}
