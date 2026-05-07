import { Request, Response } from "express";
import { Service } from "typedi";

import { TransferService } from "../service/transfer.service";
import { success, failure } from "../../../Http_Response/response";

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

  public getPendingTransfers = async(req:Request,res:Response)=>{
    try{
        const userId = Number(req.user?.id);

        const transfers = 
        await this.transferService.getPendingTransfers(userId);

        return res.status(200).json(
            success(transfers,"Pending transfers fetched successfully")
        )
    }catch(error:any){
        return res.status(400)
        .json(
            failure(
                error.message||"failed to fetch pending request"
            )
        )
    }
  }
}
