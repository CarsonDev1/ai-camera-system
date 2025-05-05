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

/**
 * Service for fetching compliance trend data
 */
const ComplianceTrendService = {
  /**
   * Get compliance trend data from the API
   * @param periodType - The type of period to get data for (day, week, month)
   * @returns Promise with compliance trend data
   */
  getComplianceTrend: async (periodType: 'day' | 'week' | 'month' = 'day'): Promise<ComplianceTrendData> => {
    try {
      const response = await api.get<ComplianceTrendResponse>(
        `/method/fire_alarm_app.custom_api.dashboard_api.get_compliance_trend?period_type=${periodType}`
      );
      return response.data.message;
    } catch (error) {
      console.error('Error fetching compliance trend data:', error);
      // Return empty data structure if API fails
      return {
        period_type: periodType,
        categories: [],
        series: [
          { name: 'Tỷ lệ đi trễ', data: [] },
          { name: 'Tỷ lệ về sớm', data: [] }
        ]
      };
    }
  }
};

export default ComplianceTrendService;