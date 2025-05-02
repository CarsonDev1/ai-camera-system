import api from "@/utils/api";

export interface ComplianceData {
  current: {
    month: string;
    compliance_rate: number;
  };
  previous: {
    month: string;
    compliance_rate: number;
  };
  delta: number;
}

export interface OnTimeComplianceResponse {
  message: {
    message: ComplianceData;
  };
}

const OnTimeComplianceService = {
  getOnTimeCompliance: async (): Promise<ComplianceData> => {
    const response = await api.get<OnTimeComplianceResponse>('/method/fire_alarm_app.custom_api.dashboard_api.get_on_time_compliance');
    return response.data.message.message;
  }
};

export default OnTimeComplianceService;