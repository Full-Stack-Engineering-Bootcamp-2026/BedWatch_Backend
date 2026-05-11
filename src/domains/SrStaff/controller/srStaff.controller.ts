import { Request, Response } from "express";
import { Service } from "typedi";

import { SeniorStaffService } from "../service/srStaff.service";

import { success, failure } from "../../../Http_Response/response";

@Service()
export class SeniorStaffController {
  constructor(private seniorStaffService: SeniorStaffService) {}
  public getDashboardSummary = async (req: Request, res: Response) => {
    try {
      const summary = await this.seniorStaffService.getDashboardSummary();
      return res
        .status(200)
        .json(success(summary, "Dashboard summary fetched successfully"));
    } catch (error: any) {
      return res
        .status(400)
        .json(failure(error.message || "Failed to fetch dashboard summary"));
    }
  };
  public getWardOccupancy = async (_req: Request, res: Response) => {
    try {
      const wards = await this.seniorStaffService.getWardOccupancy();
      return res
        .status(200)
        .json(success(wards, "Ward occupancy fetched successfully"));
    } catch (error: any) {
      return res
        .status(400)
        .json(failure(error.message || "Failed to fetch ward occupancy"));
    }
  };

  public getSystemAlerts = async (_req: Request, res: Response) => {
    try {
      const alerts = await this.seniorStaffService.getSystemAlerts();
      return res
        .status(200)
        .json(success(alerts, "Alerts fetched successfully"));
    } catch (error: any) {
      return res
        .status(400)
        .json(failure(error.message || "Failed to fetch alerts"));
    }
  };

  public getDashboardTrends = async (_req: Request, res: Response) => {
    try {
      const trends = await this.seniorStaffService.getDashboardTrends();

      return res
        .status(200)
        .json(success(trends, "Dashboard trends fetched successfully"));
    } catch (error: any) {
      return res
        .status(400)
        .json(failure(error.message || "Failed to fetch dashboard trends"));
    }
  };

  public getProfile = async (req: Request, res: Response) => {
    try {
      const userId = Number(req.user?.id);

      const profile = await this.seniorStaffService.getProfile(userId);

      return res
        .status(200)
        .json(success(profile, "Senior staff profile fetched successfully"));
    } catch (error: any) {
      return res
        .status(400)
        .json(failure(error.message || "Failed to fetch profile"));
    }
  };

  


}
