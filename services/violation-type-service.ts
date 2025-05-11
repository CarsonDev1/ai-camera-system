import api from "@/utils/api";

export interface ViolationType {
  violation_type: string;
  cnt: number;
  percent: number;
  weeks: any
}

export interface ViolationTypeDistributionData {
  period_type: string;
  period_start: string;
  period_end: string;
  total: number;
  data: ViolationType[];
  weeks: any
}

export interface ViolationTypeDistributionResponse {
  message: ViolationTypeDistributionData;
}

/**
 * Service for fetching violation type distribution data
 */
const ViolationTypeService = {
  /**
   * Get violation type distribution data from the API
   * @param periodType - The type of period to get data for (day, week, month)
   * @returns Promise with violation type distribution data
   */
  getViolationTypeDistribution: async (periodType: 'day' | 'week' | 'month' = 'week'): Promise<ViolationTypeDistributionData> => {
    try {
      const response = await api.get<ViolationTypeDistributionResponse>(
        `/method/fire_alarm_app.custom_api.dashboard_api.get_violation_type_distribution?period_type=${periodType}`
      );
      return response.data.message;
    } catch (error) {
      console.error('Error fetching violation type distribution data:', error);
      // Return empty data structure if API fails
      return {
        period_type: periodType,
        period_start: '',
        period_end: '',
        total: 0,
        data: [],
        weeks: ''
      };
    }
  }
};

export default ViolationTypeService;