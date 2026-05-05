import { jwtPayload } from "../../domains/auth/interface/jwt.payload.interface";

declare global {
  namespace Express {
    interface Request {
      user?: jwtPayload;
    }
  }
}
