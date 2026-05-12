import { Request,Response} from "express";
import { getStaffDashboardService,getAdmissionService,createAdmissionService} from "../service/user.staff.service";
import { dischargePatientService } from "../service/user.staff.service";

export const getStaffDashboardController =
  async (
    req: Request,
    res: Response
  ) => {
    try {

      const userId =
        req.user!.id;

      const data =
        await getStaffDashboardService(
          userId
        );

      return res.status(200).json({
        success: true,
        data,
      });

    } catch (error: any) {

      return res.status(400).json({
        success: false,
        message:
          error.message,
      });
    }
  };

export const getAdmissionController =
  async (
    req: Request,
    res: Response
  ) => {
    try {

      const userId =
        req.user!.id;

      const data =
        await getAdmissionService(
          userId
        ); 

      return res.status(200).json({
        success: true,
        data,
      });

    } catch (error: any) {

      return res.status(400).json({
        success: false,
        message:
          error.message,
      });
    }
  };

export const createAdmissionController =
  async (
    req: Request,
    res: Response
  ) => {
    try {

      const userId =
        req.user!.id;

      const result =
        await createAdmissionService(
          req.body,
          userId
        );

      return res.status(201).json({
        success: true,
        message:
          "Patient admitted successfully",
        data: result,
      });

    } catch (error: any) {

      return res.status(400).json({
        success: false,
        message:
          error.message,
      });
    }
  };

  export const dischargePatientController =
  async (
    req: Request,
    res: Response
  ) => {

    const bedId =
      Number(req.params.id);

    const data =
      await dischargePatientService(
        bedId
      );

    return res.status(200).json({
      success: true,
      data,
    });
  };