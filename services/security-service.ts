import api from "@/utils/api";

export interface MonthlyRate {
  month: string;
  rate: number;
}

export interface SecurityAlertData {
  current: MonthlyRate;
  previous: MonthlyRate;
  delta: number;
}

export interface SecurityAlertResponse {
  message: {
    message: SecurityAlertData;
  };
}

const SecurityAlertService = {
  getSecurityAlertRate: async (): Promise<SecurityAlertData> => {
    const response = await api.get<SecurityAlertResponse>('/method/fire_alarm_app.custom_api.dashboard_api.get_security_alert');
    return response.data.message.message;
  }
};

export default SecurityAlertService;