import api from "@/utils/api";

export interface TimeRateData {
  current: {
    month: string;
    rate: number;
  };
  previous: {
    month: string;
    rate: number;
  };
  delta: number;
}

export interface TardinessData {
  late: TimeRateData;
  early: TimeRateData;
}

export interface TardinessResponse {
  message: {
    message: TardinessData;
  };
}

const TardinessService = {
  getTardinessAndEarlyLeave: async (): Promise<TardinessData> => {
    const response = await api.get<TardinessResponse>('/method/fire_alarm_app.custom_api.dashboard_api.get_tardiness_and_early_leave');
    return response.data.message.message;
  }
};

export default TardinessService;