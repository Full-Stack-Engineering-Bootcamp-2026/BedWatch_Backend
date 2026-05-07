import { Request, Response } from "express";

import { getStaffDashboardService } from "../service/user.staff.service";

export const getStaffDashboardController =
  async (
    req: Request,
    res: Response
  ) => {
    try {
        const userId = Number(req.params.id);

      const data =
        await getStaffDashboardService(
          userId
          );
        console.log(data);
        

      res.status(200).json(data);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Failed to fetch dashboard",
      });
    }
  };