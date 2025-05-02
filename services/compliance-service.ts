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

export interface ComplianceResponse {
  message: ComplianceData;
}

const PPEComplianceService = {
  getPPECompliance: async (): Promise<ComplianceData> => {
    const response = await api.get<ComplianceResponse>('/method/fire_alarm_app.custom_api.dashboard_api.get_ppe_compliance');
    return response.data.message;
  },
};

export default PPEComplianceService;