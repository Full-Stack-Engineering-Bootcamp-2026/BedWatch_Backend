import { Request, Response, NextFunction } from "express";
import { Service } from "typedi";
import { jwtPayload } from "../interface/jwt.payload.interface";

@Service()
export class AuthorizationMiddleware {
  public allowRoles = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      const user = req.user as jwtPayload;

      if (!user) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }

      if (!roles.includes(user.role)) {
        return res.status(403).json({
          message: "Forbidden: insufficient permissions",
        });
      }

      next();
    };
  };
}
