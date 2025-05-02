import api from "@/utils/api";

export interface ViolationType {
  violation_type: string;
  violation_count: number;
  icon: string;
  color: string;
}

export interface ViolationFrequencyData {
  month: string;
  data: ViolationType[];
}

export interface ViolationFrequencyResponse {
  message: ViolationFrequencyData;
}

const ViolationFrequencyService = {
  getViolationFrequency: async (): Promise<ViolationFrequencyData> => {
    const response = await api.get<ViolationFrequencyResponse>('/method/fire_alarm_app.custom_api.dashboard_api.get_violation_frequency');
    return response.data.message;
  }
};

export default ViolationFrequencyService;