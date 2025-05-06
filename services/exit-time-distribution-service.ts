import api from '@/utils/api';

/**
 * Interface for each data series in the entry-exit distribution
 */
export interface TimeDistributionSeries {
  name: string;
  data: number[];
}

/**
 * Interface for the complete entry-exit time distribution data
 */
export interface EntryExitTimeDistribution {
  period_type: string;
  categories: string[];
  series: TimeDistributionSeries[];
}

/**
 * Interface for the entry-exit time distribution API response
 */
export interface EntryExitTimeDistributionResponse {
  message: {
    message: EntryExitTimeDistribution;
  };
}

/**
 * Service responsible for fetching entry and exit time distribution data
 */
const EntryExitService = {
  /**
   * Get entry and exit time distribution data
   * @param periodType Optional parameter to specify the period type (e.g., 'day', 'week', 'month')
   * @returns Promise containing entry-exit time distribution data
   */
  getEntryExitTimeDistribution: async (periodType?: string): Promise<EntryExitTimeDistribution> => {
    try {
      // Construct the URL with optional query parameter
      let url = '/method/fire_alarm_app.custom_api.dashboard_api.get_entry_exit_time_distribution';
      if (periodType) {
        url += `?period_type=${periodType}`;
      }

      const response = await api.get<EntryExitTimeDistributionResponse>(url);

      // Return the message.message object which contains the actual data
      return response.data.message.message;
    } catch (error) {
      console.error('Error fetching entry-exit time distribution:', error);
      throw error;
    }
  },
};

export default EntryExitService;