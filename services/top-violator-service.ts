import api from "@/utils/api";

export interface TimeViolator {
  employee: string;
  employee_name: string;
  total_violations: number;
  late_violations: number;
  early_violations: number;
}

export interface TopTimeViolatorsData {
  month: string;
  top_violators: TimeViolator[];
}

export interface TopTimeViolatorsResponse {
  message: {
    message: TopTimeViolatorsData;
  };
}

const TopTimeViolatorsService = {
  getTopTimeViolators: async (): Promise<TopTimeViolatorsData> => {
    const response = await api.get<TopTimeViolatorsResponse>('/method/fire_alarm_app.custom_api.dashboard_api.get_top_time_violators');
    return response.data.message.message;
  }
};

export default TopTimeViolatorsService;