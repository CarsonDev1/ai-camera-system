import api from "@/utils/api";

export interface ViolationLocation {
  location: string;
  violation_count: number;
}

export interface PeriodInfo {
  type: 'day' | 'week' | 'month';
  from: string;
  to: string;
}

export interface TopViolationLocationsData {
  data: ViolationLocation[];
  period: PeriodInfo;
}

export interface TopViolationLocationsResponse {
  message: TopViolationLocationsData;
}

/**
 * Service for fetching top violation locations data
 */
const TopViolationLocationsService = {
  /**
   * Get top 5 violation locations from the API
   * @param periodType - Optional period type (day, week, month)
   * @returns Promise with top violation locations data
   */
  getTopViolationLocations: async (periodType?: 'day' | 'week' | 'month'): Promise<TopViolationLocationsData> => {
    try {
      // Build the URL with optional period parameter
      let url = '/method/fire_alarm_app.custom_api.dashboard_api.get_top5_violation_locations';
      if (periodType) {
        url += `?period_type=${periodType}`;
      }

      const response = await api.get<TopViolationLocationsResponse>(url);
      return response.data.message;
    } catch (error) {
      console.error('Error fetching top violation locations data:', error);
      // Return empty data structure if API fails
      return {
        data: [],
        period: {
          type: 'month',
          from: '',
          to: ''
        }
      };
    }
  }
};

export default TopViolationLocationsService;