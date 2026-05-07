import { Request, Response, NextFunction } from "express";
import { Service } from "typedi";
import { AuthService } from "../service/auth.service";
import { jwtPayload } from "../interface/jwt.payload.interface";

@Service()
export class AuthenticationMiddleware {
  constructor(private authService: AuthService) {}

  public use = (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          message: "Authentication token missing",
        });
      }

      const token = authHeader.split(" ")[1];

      const decoded = this.authService.verifyToken(token);

      req.user = decoded as jwtPayload;

      next();
    } catch (error) {
      return res.status(401).json({
        message: "Invalid or expired token",
      });
    }
  };
}
