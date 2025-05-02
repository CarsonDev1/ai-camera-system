import api from "@/utils/api";

export interface BehaviorViolationData {
  current: {
    month: string;
    count: number;
  };
  previous: {
    month: string;
    count: number;
  };
  percentage: number;
  delta: number;
}

export interface BehaviorViolationResponse {
  message: BehaviorViolationData;
}

const BehaviorViolationService = {
  getBehaviorViolationTrend: async (): Promise<BehaviorViolationData> => {
    const response = await api.get<BehaviorViolationResponse>('/method/fire_alarm_app.custom_api.dashboard_api.get_behavior_violation_trend');
    return response.data.message;
  }
};

export default BehaviorViolationService;