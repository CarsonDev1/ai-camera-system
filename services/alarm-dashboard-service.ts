import api from "@/utils/api";

export interface AlarmStatusCount {
  count: number;
  delta: number;
}

export interface AlarmTypeStatus {
  total: AlarmStatusCount;
  pending: AlarmStatusCount;
  in_progress: AlarmStatusCount;
  done: AlarmStatusCount;
}

export interface AlarmCounts {
  [alarmType: string]: AlarmTypeStatus;
}

export interface AlarmCountsResponse {
  message: {
    message: AlarmCounts;
  };
}

const AlarmDashboardService = {
  getAlarmCounts: async (): Promise<AlarmCounts> => {
    const response = await api.get<AlarmCountsResponse>('/method/fire_alarm_app.custom_api.dashboard_api.get_alarm_counts_for_dashboard');
    return response.data.message.message;
  }
};

export default AlarmDashboardService;