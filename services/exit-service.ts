import api from "@/utils/api";

export type PeriodType = "day" | "week" | "month";

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
  getStats: async (periodType: PeriodType): Promise<EntryExitStats> => {
    const response = await api.get<EntryExitStatsResponse>(
      `/method/fire_alarm_app.custom_api.dashboard_api.get_entry_exit_stats`,
      {
        params: { period_type: periodType },
      }
    );
    return response.data.message.message;
  },
};

export default EntryExitStatsService;
