import api from "@/utils/api";

export interface MonthlyIntrusionData {
  month: string;
  total_intrusion_alerts: number;
  processed_intrusion_alerts: number;
}

export interface MonthlyIntrusionStatsData {
  data: MonthlyIntrusionData[];
}

export interface MonthlyIntrusionStatsResponse {
  message: {
    message: MonthlyIntrusionStatsData;
  };
}

export interface IntrusionAlertSummary {
  total_intrusion_alerts: any;
  processed_intrusion_alerts: any;
}

export interface IntrusionAlertSummaryResponse {
  message: {
    message: IntrusionAlertSummary;
  };
}

const IntrusionAlertService = {
  getMonthlyIntrusionStats: async (): Promise<MonthlyIntrusionStatsData> => {
    const response = await api.get<MonthlyIntrusionStatsResponse>('/method/fire_alarm_app.custom_api.dashboard_api.get_monthly_intrusion_alert_stats');
    return response.data.message.message;
  },

  getIntrusionAlertSummary: async (): Promise<IntrusionAlertSummary> => {
    const response = await api.get<IntrusionAlertSummaryResponse>('/method/fire_alarm_app.custom_api.dashboard_api.get_intrusion_alert_stats');
    return response.data.message.message;
  }
};

export default IntrusionAlertService;