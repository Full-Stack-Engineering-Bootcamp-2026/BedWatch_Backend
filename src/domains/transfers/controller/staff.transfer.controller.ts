import {
  Request,
  Response,
} from "express";

import { Service } from "typedi";

import {
  success,
  failure,
} from "../../../Http_Response/response";

import { CreateTransferDto } from "../dto/transfer.dto";

import { StaffTransferService } from "../service/patient.transfer.service";

@Service()
export class StaffTransferController {

  constructor(
    private staffTransferService: StaffTransferService,
  ) {}

  public createTransferRequest =
    async (
      req: Request,
      res: Response,
    ) => {

      try {

        const payload: CreateTransferDto =
          req.body;

        const userId =
          Number(
            req.user?.id,
          );

        const transfer =
          await this.staffTransferService.createTransferRequest(
            payload,
            userId,
          );

        return res
          .status(201)
          .json(
            success(
              transfer,
              "Transfer request created successfully",
            ),
          );

      } catch (error: any) {

        console.log(
          "TRANSFER ERROR:",
          error,
        );

        return res
          .status(400)
          .json(
            failure(
              error.message ||
                "Failed to create transfer request",
            ),
          );

      }
    };

  public getMyTransferRequests =
    async (
      req: Request,
      res: Response,
    ) => {

      try {

        const userId =
          Number(
            req.user?.id,
          );

        const transfers =
          await this.staffTransferService.getMyTransferRequests(
            userId,
          );

        return res
          .status(200)
          .json(
            success(
              transfers,
              "Transfer requests fetched successfully",
            ),
          );

      } catch (error: any) {

        return res
          .status(400)
          .json(
            failure(
              error.message ||
                "Failed to fetch transfer requests",
            ),
          );

      }
    };
}