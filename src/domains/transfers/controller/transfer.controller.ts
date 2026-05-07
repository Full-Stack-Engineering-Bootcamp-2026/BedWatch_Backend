import { Request, Response } from "express";
import { Service } from "typedi";

import { TransferService } from "../service/transfer.service";
import { success, failure } from "../../../Http_Response/response";
import { fail } from "node:assert";

@Service()
export class TransferController {
  constructor(private transferService: TransferService) {}

  public createTransferRequest = async (req: Request, res: Response) => {
    try {
      const { patientId, toBedId } = req.body;

      const userid = Number(req.user?.id);
      const transfer = await this.transferService.createtransferRequest(
        patientId,
        toBedId,
        userid,
      );

      return res
        .status(201)
        .json(success(transfer, "Transfer request created successfully"));
    } catch (error: any) {
      return res
        .status(400)
        .json(failure(error.message || "failed to create transfer request"));
    }
  };

  public getPendingTransfers = async (req: Request, res: Response) => {
    try {
      const userId = Number(req.user?.id);

      const transfers = await this.transferService.getPendingTransfers(userId);

      return res
        .status(200)
        .json(success(transfers, "Pending transfers fetched successfully"));
    } catch (error: any) {
      return res
        .status(400)
        .json(failure(error.message || "failed to fetch pending request"));
    }
  };

  public approveTransfer = async (req: Request, res: Response) => {
    try {
      const transferId = Number(req.params.id);
      const userId = Number(req.user?.id);
      const transfer = await this.transferService.approveTransfer(
        transferId,
        userId,
      );

      return res
        .status(200)
        .json(success(transfer, "Transfer approved successfully"));
    } catch (error: any) {
      return res
        .status(400)
        .json(failure(error.message || "Failed to approve transfer"));
    }
  };

  public rejectTransfer = async (
    req:Request,
    res:Response
  )=>{
    try{
        const transferId = Number(req.params.id);
    const userId = Number(req.user?.id)

    const transfer=
    await this.transferService.rejectTranfer(
        transferId,
        userId
    );

    return res.status(200).json(
        success(
            transfer,
            "Transfer Rejected Successfully"
        )
    )
    }catch(error:any){
        return res.status(400).json(
            failure(
                error.message|| "Failed to Reject Transfer"
            )
        )
    }
    
  }
}
