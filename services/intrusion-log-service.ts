import api from "@/utils/api";

export interface IntrusionLogEntry {
  time: string;
  position: string;
  event: string;
  entity: string;
  status: string;
}

export interface IntrusionLogResponse {
  message: {
    data: IntrusionLogEntry[];
  };
}

const IntrusionLogService = {
  /**
   * Fetch intrusion log entries from the API
   * @returns Promise with array of intrusion log entries
   */
  getIntrusionLogs: async (): Promise<IntrusionLogEntry[]> => {
    const response = await api.get<IntrusionLogResponse>('/method/fire_alarm_app.custom_api.dashboard_api.get_intrusion_log');
    return response.data.message.data;
  },

  /**
   * Get pending intrusion logs (not yet handled)
   * @returns Promise with array of pending intrusion logs
   */
  getPendingIntrusionLogs: async (): Promise<IntrusionLogEntry[]> => {
    const logs = await IntrusionLogService.getIntrusionLogs();
    return logs.filter(log => log.status === "Chưa xử lý");
  },

  /**
   * Get handled intrusion logs
   * @returns Promise with array of handled intrusion logs
   */
  getHandledIntrusionLogs: async (): Promise<IntrusionLogEntry[]> => {
    const logs = await IntrusionLogService.getIntrusionLogs();
    return logs.filter(log => log.status === "Đã xử lý");
  },

  /**
   * Get logs from a specific position/location
   * @param position The position to filter by
   * @returns Promise with array of filtered intrusion logs
   */
  getLogsByPosition: async (position: string): Promise<IntrusionLogEntry[]> => {
    const logs = await IntrusionLogService.getIntrusionLogs();
    return logs.filter(log => log.position.includes(position));
  },

  /**
   * Get logs by date range
   * @param startDate Start date in DD/MM/YYYY format
   * @param endDate End date in DD/MM/YYYY format
   * @returns Promise with array of filtered intrusion logs
   */
  getLogsByDateRange: async (startDate: string, endDate: string): Promise<IntrusionLogEntry[]> => {
    const logs = await IntrusionLogService.getIntrusionLogs();

    // Helper function to convert DD/MM/YYYY HH:MM to Date object
    const parseDate = (dateString: string): Date => {
      const [datePart, timePart] = dateString.split(' ');
      const [day, month, year] = datePart.split('/').map(part => parseInt(part));
      const [hour, minute] = timePart ? timePart.split(':').map(part => parseInt(part)) : [0, 0];

      return new Date(year, month - 1, day, hour, minute);
    };

    const start = parseDate(startDate);
    const end = parseDate(endDate);

    return logs.filter(log => {
      const logDate = parseDate(log.time);
      return logDate >= start && logDate <= end;
    });
  },

  /**
   * Get logs for the current month
   * @returns Promise with array of filtered intrusion logs
   */
  getCurrentMonthLogs: async (): Promise<IntrusionLogEntry[]> => {
    const logs = await IntrusionLogService.getIntrusionLogs();

    const now = new Date();
    const currentMonth = now.getMonth() + 1; // JavaScript months are 0-indexed
    const currentYear = now.getFullYear();

    return logs.filter(log => {
      const [datePart] = log.time.split(' ');
      const [day, month, year] = datePart.split('/').map(part => parseInt(part));

      return month === currentMonth && year === currentYear;
    });
  }
};

export default IntrusionLogService;