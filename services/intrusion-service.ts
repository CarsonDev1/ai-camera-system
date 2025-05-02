import api from "@/utils/api";

export interface MonthlyCount {
  month: string;
  count: number;
}

export interface IntrusionStatsData {
  current: MonthlyCount;
  previous: MonthlyCount;
  delta: number;
}

export interface IntrusionStatsResponse {
  message: {
    message: IntrusionStatsData;
  };
}

const IntrusionStatsService = {
  getIntrusionStats: async (): Promise<IntrusionStatsData> => {
    const response = await api.get<IntrusionStatsResponse>('/method/fire_alarm_app.custom_api.dashboard_api.get_intrusion_stats');
    return response.data.message.message;
  }
};

export default IntrusionStatsService;