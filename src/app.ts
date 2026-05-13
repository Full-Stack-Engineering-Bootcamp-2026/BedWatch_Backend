import express, { Application as ExpressApp, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import "reflect-metadata";

import AppDataSource from "./db/data-source";
import { success, failure } from "./Http_Response/response";

import { AuthRoutes } from "./domains/auth/routes/auth.routes";
import { AuthenticationMiddleware } from "./domains/auth/middleware/authenticate.middleware";

import { Router } from "express";
import Container from "typedi";

import { WardRoutes } from "./domains/ward/routes/ward.routes";
import { UserRoutes } from "./domains/user/routes/user.routes";

import { TransferRoutes } from "./domains/transfers/routes/transfer.routes";
import { SeniorStaffRoutes } from "./domains/SrStaff/routes/Staff.routes";

import { UserAdminRoutes } from "./domains/user/routes/user.admin.routes";
import { WardAdminRoutes } from "./domains/ward/routes/ward.admin.routes";

import { ForgotPasswordRoutes } from "./domains/forgot-password/routes/forgotPassword.routes";

import { StaffRoutes } from "./domains/user/routes/user.staff.routes";

import { BedRoutes } from "./domains/bed/route/bed.route";

import { StaffTransferRoutes } from "./domains/transfers/routes/staff-patient.transfer.route";

dotenv.config();

class Application {
  public app: ExpressApp;
  private port: number;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT || "3000", 10);

    this.initializeMiddleware();
    this.initializeRoutes();
  }

  private initializeMiddleware(): void {
    const allowedOrigins = (
      process.env.ALLOWED_ORIGINS || "http://localhost:5173"
    ).split(",");

    this.app.use(
      cors({
        origin: (origin, callback) => {
          if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
          } else {
            callback(new Error(`CORS not allowed: ${origin}`));
          }
        },
        credentials: true,
      }),
    );

    this.app.use(express.json());

    this.app.use(express.urlencoded({ extended: true }));
  }

  private initializeRoutes(): void {
    const v1Router = Router();

    v1Router.get("/", (_req: Request, res: Response) => {
      return res.json(success(null, "Server is running"));
    });

    const authMiddleware = Container.get(AuthenticationMiddleware);

   

    const wardRoutes = Container.get(WardRoutes);
    const authRoutes = Container.get(AuthRoutes);
    const userRoutes = Container.get(UserRoutes);
    const transferRoute = Container.get(TransferRoutes);
    const srStaffRoute = Container.get(SeniorStaffRoutes);
    const userAdminRoutes = Container.get(UserAdminRoutes);
    const wardAdminRoutes = Container.get(WardAdminRoutes);
    const forgotPasswordRoutes = Container.get(ForgotPasswordRoutes);
    const staffRoutes = Container.get(StaffRoutes);
    const bedRoutes = Container.get(BedRoutes);
    const staffTrasferRoutes = Container.get(StaffTransferRoutes);
    v1Router.use("/wards", wardRoutes.router);
    v1Router.use("/auth", authRoutes.router);
    v1Router.use("/users", userRoutes.router);
    v1Router.use("/transfers", transferRoute.router);
    v1Router.use("/senior-staff", srStaffRoute.router);
    v1Router.use("/usersAdmin", userAdminRoutes.router);
    v1Router.use("/wardsAdmin", wardAdminRoutes.router);
    v1Router.use("/authF", forgotPasswordRoutes.router);
    v1Router.use("/staff-dashboard", staffRoutes.router);
    v1Router.use("/staff/transfers", staffTrasferRoutes.router);
    v1Router.use("/beds", bedRoutes.router);
    this.app.use("/api/v1", v1Router);
  }

  private async connectDatabase(): Promise<void> {
    try {
      await AppDataSource.initialize();

      console.log("MySQL connected");
    } catch (error) {
      console.error("Database connection failed", error);

      process.exit(1);
    }
  }

  public async start(): Promise<void> {
    try {
      await this.connectDatabase();

      this.app.listen(this.port, () => {
        console.log(`Server running at http://localhost:${this.port}`);
      });
    } catch (error) {
      console.error("Startup failed", error);
    }
  }
}

const application = new Application();

application.start();

export default application.app;
