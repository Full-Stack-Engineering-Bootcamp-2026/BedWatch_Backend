import { Service } from "typedi";
import { AppDataSource } from "../../../db/db";
import { User, UserRole } from "../../user/entity/user.entity";
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
    };
  }

  public async createAdmin(name: string, email: string, password: string) {
    const existingUser = await this.userRepo.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new Error("Admin already exists");
    }

    const hashedPassword = await this.hashPassword(password);

    const admin = this.userRepo.create({
      name,
      email,
      password: hashedPassword,
      role: UserRole.ADMIN,
    });

    await this.userRepo.save(admin);

    return admin;
  }

  public async login(email: string, password: string) {
    const user = await this.userRepo.findOne({
      where: { email },
    });

    if (!user) {
      console.log("User not found");
      return null;
    }

    const isMatch = await this.Comparepassword(password, user.password);

    if (!isMatch) {
      console.log("Password incorrect");
      return null;
    }

    const token = this.generateToken(user);

    return { token, user };
  }
}
