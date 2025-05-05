import api from "@/utils/api";

export interface ComplianceTrendSeries {
  name: string;
  data: number[];
}

export interface ComplianceTrendData {
  period_type: string;
  categories: string[];
  series: ComplianceTrendSeries[];
}

export interface ComplianceTrendResponse {
  message: ComplianceTrendData;
}

const ComplianceTrendService = {
  getComplianceTrend: async (periodType: 'day' | 'week' | 'month' = 'day'): Promise<ComplianceTrendData> => {
    const response = await api.get<ComplianceTrendResponse>(
      `/method/fire_alarm_app.custom_api.dashboard_api.get_compliance_trend?period_type=${periodType}`
    );
    return response.data.message;
  }
};

export default ComplianceTrendService;