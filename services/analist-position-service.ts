import axios from 'axios';

export interface LocationDistributionItem {
  location: string;
  count: number;
  percent: number;
}

export interface LocationDistributionResponse {
  message: {
    period_type: string;
    period_start: string;
    period_end: string;
    total: number;
    data: LocationDistributionItem[];
  };
}

export type PeriodType = 'day' | 'week' | 'month' | 'year';

/**
 * Service for fetching dashboard and analytics data
 */
const DashboardService = {
  /**
   * Get location distribution data
   * @param periodType - The period type for the data (day, week, month, year)
   * @returns Promise containing the location distribution data
   */
  getLocationDistribution: async (periodType: PeriodType = 'week'): Promise<LocationDistributionResponse> => {
    try {
      const response = await axios.get<LocationDistributionResponse>(
        `https://dev4.tadalabs.vn/api/method/fire_alarm_app.custom_api.dashboard_api.get_location_distribution?period_type=${periodType}`
      );
      return response.data;
    } catch (error: any) {
      console.error('Error fetching location distribution:', error);
      throw new Error(
        error.response?.data?.message ||
        'Failed to fetch location distribution data'
      );
    }
  },

  /**
   * Format date string from the API into a more readable format
   * @param dateString - The date string from the API (e.g. "2025-05-05 00:00:00")
   * @returns Formatted date string (e.g. "May 5, 2025")
   */
  formatDateString: (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },

  /**
   * Get a human-readable period description based on period_start and period_end
   * @param periodStart - Start date of the period
   * @param periodEnd - End date of the period 
   * @param periodType - Type of period (day, week, month, year)
   * @returns Human-readable period description
   */
  getPeriodDescription: (
    periodStart: string,
    periodEnd: string,
    periodType: PeriodType
  ): string => {
    const startDate = new Date(periodStart);
    const endDate = new Date(periodEnd);

    switch (periodType) {
      case 'day':
        return DashboardService.formatDateString(periodStart);

      case 'week':
        return `Week of ${startDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        })} - ${endDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })}`;

      case 'month':
        return startDate.toLocaleDateString('en-US', {
          month: 'long',
          year: 'numeric'
        });

      case 'year':
        return startDate.getFullYear().toString();

      default:
        return `${DashboardService.formatDateString(periodStart)} - ${DashboardService.formatDateString(periodEnd)}`;
    }
  }
};

export default DashboardService;