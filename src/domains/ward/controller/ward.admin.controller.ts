import { Request, Response } from "express";

import { Service } from "typedi";

import { WardAdminService } from "../services/ward.admin.service";

import { success, failure } from "../../../Http_Response/response";

@Service()
export class WardAdminController {
  constructor(private wardAdminService: WardAdminService) {}

  public getWardSummary = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const wards = await this.wardAdminService.getWardSummary();

      res.json(success(wards, "Ward summary fetched successfully"));
    } catch (error: any) {
      console.log(error);

      res
        .status(500)
        .json(failure(error.message || "Failed to fetch ward summary"));
    }
  };
  public getBedsByWardId = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const wardId = Number(req.params.id);

      const beds = await this.wardAdminService.getBedsByWardId(wardId);

      res.json(success(beds, "Beds fetched successfully"));
    } catch (error: any) {
      console.log(error);

      res.status(500).json(failure(error.message || "Failed to fetch beds"));
    }
  };
  public getAllWards = async (req: Request, res: Response): Promise<void> => {
    try {
      const wards = await this.wardAdminService.getAllWards();

      res.json(success(wards, "Wards fetched successfully"));
    } catch (error: any) {
      console.log(error);

      res.status(500).json(failure(error.message || "Failed to fetch wards"));
    }
  };

  public updateWard = async (req: Request, res: Response): Promise<void> => {
    try {
      const wardId = Number(req.params.id);

      const updatedWard = await this.wardAdminService.updateWard(
        wardId,
        req.body,
      );

      res.json(success(updatedWard, "Ward updated successfully"));
    } catch (error: any) {
      console.log(error);

      res.status(500).json(failure(error.message || "Failed to update ward"));
    }
  };

  public deleteWard = async (req: Request, res: Response): Promise<void> => {
    try {
      const wardId = Number(req.params.id);

      await this.wardAdminService.deleteWard(wardId);

      res.json(success(null, "Ward deleted successfully"));
    } catch (error: any) {
      console.log(error);

      res.status(500).json(failure(error.message || "Failed to delete ward"));
    }
  };
}
