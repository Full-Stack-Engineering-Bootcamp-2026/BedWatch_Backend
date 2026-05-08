import { Request, Response } from "express";

import { getStaffDashboardService } from "../service/user.staff.service";

import {success,failure} from "../../../Http_Response/response";

export  const getStaffDashboardController = async (
  req: Request,
  res: Response
) => {  
  try {
    const userId = Number(req.params.id);

    if (isNaN(userId)) {
      return res.status(400).json(
        failure("Invalid user id")
      );
    }

    const data =
      await getStaffDashboardService(userId);

    return res.status(200).json(
      success(
        data,
        "Dashboard fetched successfully"
      )
    );
  } catch (error: any) {
    console.error(error);

    return res.status(500).json(
      failure(
        error.message ||
          "Failed to fetch dashboard"
      )
    );
  }
};