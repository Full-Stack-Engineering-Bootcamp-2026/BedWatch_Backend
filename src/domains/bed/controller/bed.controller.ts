import {
  Request,
  Response,
} from "express";

import { Service } from "typedi";

import { BedService } from "../service/bed.service";

import {
  success,
  failure,
} from "../../../Http_Response/response";

@Service()
export class BedController {
  constructor(
    private bedService: BedService,
  ) {}

  public getAvailableBedsByWard =
    async (
      req: Request,
      res: Response,
    ) => {
      try {
        const wardId = Number(
          req.query.wardId
        );

        const beds =
          await this.bedService.getAvailableBedsByWard(
            wardId,
          );

        return res.status(200).json(
          success(
            beds,
            "Available beds fetched successfully",
          ),
        );
      } catch (error: any) {
        return res.status(400).json(
          failure(
            error.message ||
              "Failed to fetch beds",
          ),
        );
      }
    };
}