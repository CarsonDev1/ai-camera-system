import api from "@/utils/api";

export type PeriodType = "day" | "week" | "month" | "custom";

export interface CountStats {
  count: number;
  percent: number;
}

export interface EntryExitStats {
  total: CountStats;
  enter: CountStats;
  exit: CountStats;
}

export interface EntryExitStatsResponse {
  message: {
    message: EntryExitStats;
  };
}

const EntryExitStatsService = {
  getStats: async (periodType: PeriodType, customDateRange?: { from: Date; to: Date }): Promise<EntryExitStats> => {
    const params: Record<string, string> = {
      period_type: periodType,
    };

    // Nếu là custom và có khoảng thời gian, thêm tham số
    if (periodType === "custom" && customDateRange) {
      params.from_date = customDateRange.from.toISOString().split('T')[0]; // Format: YYYY-MM-DD
      params.to_date = customDateRange.to.toISOString().split('T')[0];

      // Thêm giờ nếu cần
      if (customDateRange.from.getHours() !== 0 || customDateRange.from.getMinutes() !== 0) {
        params.from_time = `${customDateRange.from.getHours().toString().padStart(2, '0')}:${customDateRange.from.getMinutes().toString().padStart(2, '0')}`;
      }

      if (customDateRange.to.getHours() !== 23 || customDateRange.to.getMinutes() !== 59) {
        params.to_time = `${customDateRange.to.getHours().toString().padStart(2, '0')}:${customDateRange.to.getMinutes().toString().padStart(2, '0')}`;
      }
    }

    const response = await api.get<EntryExitStatsResponse>(
      `/method/fire_alarm_app.custom_api.dashboard_api.get_entry_exit_stats`,
      { params }
    );

    return response.data.message.message;
  },
};

export default EntryExitStatsService;