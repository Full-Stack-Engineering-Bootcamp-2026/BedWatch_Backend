import { Service } from "typedi";
import { AppDataSource } from "../../../db/db";
import { User } from "../../user/entity/user.entity";
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";

@Service()
export class AuthService {
  private userRepo = AppDataSource.getRepository(User);

  public async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  public async Comparepassword(
    plainPass: string,
    hashedPass: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPass, hashedPass);
  }

  public generateToken(user: User): string {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      wardId: user.ward?.id,
    };

    return jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn:
        (process.env.JWT_EXPIRES_IN as SignOptions["expiresIn"]) || "1h",
    });
  }

  public verifyToken(token: string): {
    id: number;
    email: string;
    role: string;
  } {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    if (typeof decoded === "string") {
      throw new Error("Invalid token");
    }

    return decoded as {
      id: number;
      email: string;
      role: string;
      wardId?: number;
    };
  }

  public async login(email: string, password: string) {
    const user = await this.userRepo.findOne({
      where: { email },
      relations: ["ward"],
    });

    if (!user) {
      throw new Error("Invalid Email");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new Error("Invalid Password");
    }

    const token = this.generateToken(user);

    return { token, user };
  }
}
