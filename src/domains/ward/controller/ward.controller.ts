import { Request, Response } from "express";
import { Service } from "typedi";
import { WardService } from "../services/ward.service";
import { success, failure } from "../../../Http_Response/response";
import { fail } from "node:assert";

@Service()
export class WardController {
  constructor(private wardService: WardService) {}

  public getAllWards = async (req: Request, res: Response) => {
    try {
      const wards = await this.wardService.getAllWards();

      return res.status(200).json(success(wards, "Wards fetched successfully"));
    } catch (error: any) {
      return res
        .status(500)
        .json(failure(error.message || "Failed to fetch wards"));
    }
  };

  public getWardSummary = async (req: Request, res: Response) => {
    try {
      const wards = await this.wardService.getWardSummary();
      return res
        .status(200)
        .json(success(wards, "Ward summary fetched successfully"));
    } catch (error: any) {
      return res
        .status(500)
        .json(failure(error.message || "Failed to fetch ward summary"));
    }
  };

  public createWard = async (req: Request, res: Response) => {
    try {
      const { name, type, capacity, description } = req.body;

      if (!name || !type || !capacity) {
        return res
          .status(400)
          .json(failure("Name, type and capacity are required"));
      }

      if (capacity <= 0) {
        return res.status(400).json(failure("Capacity must be greater than 0"));
      }

      const result = await this.wardService.createWard(
        name,
        type,
        capacity,
        description,
      );

      if (!result.success) {
        return res.status(409).json(failure(result.message));
      }

      return res.status(201).json(success(result.data, result.message));
    } catch (error: any) {
      return res
        .status(500)
        .json(failure(error.message || "Failed to create ward"));
    }
  };
}
