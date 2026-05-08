import { getStaffDashboardRepository } from "../repository/user.staff.repository";

export const getStaffDashboardService =
  async (userId: number) => {
    return await getStaffDashboardRepository(
      userId
    );
  };