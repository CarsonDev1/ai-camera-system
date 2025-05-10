import api from "@/utils/api";

export interface SafetyAlert {
  name: string;
  employee: string | null;
  cam_id: string;
  khu_vuc: string;
  timestamp: string;
  loai_vi_pham: string;
  trang_thai: string;
  image: string;
  employee_name: string;
  department: string;
}

export interface SafetyAlertsResponse {
  message: {
    data: SafetyAlert[];
  };
}

const SafetyAlertsService = {
  /**
   * Fetch safety alerts from the API with optional pagination
   * @param page Page number (optional)
   * @param pageLength Number of records per page (optional)
   * @returns Promise with array of safety alerts
   */
  getSafetyAlerts: async (page?: number, pageLength?: number, p0?: boolean): Promise<SafetyAlert[]> => {
    let url = '/method/fire_alarm_app.custom_api.dashboard_api.get_atld_alerts_with_employee';

    // Add pagination parameters if provided
    if (page !== undefined && pageLength !== undefined) {
      url += `?page=${page}&page_length=${pageLength}`;
    }

    const response = await api.get<SafetyAlertsResponse>(url);
    return response.data.message.data;
  },

  /**
   * Get pending safety alerts (not yet handled)
   * @returns Promise with array of pending safety alerts
   */
  getPendingSafetyAlerts: async (): Promise<SafetyAlert[]> => {
    const alerts = await SafetyAlertsService.getSafetyAlerts();
    return alerts.filter(alert => alert.trang_thai === "Chưa xử lý");
  },

  /**
   * Get resolved safety alerts
   * @returns Promise with array of resolved safety alerts
   */
  getResolvedSafetyAlerts: async (): Promise<SafetyAlert[]> => {
    const alerts = await SafetyAlertsService.getSafetyAlerts();
    return alerts.filter(alert => alert.trang_thai === "Đã xử lý");
  },

  /**
   * Get safety alerts by violation type
   * @param violationType The violation type to filter by
   * @returns Promise with array of filtered safety alerts
   */
  getAlertsByViolationType: async (violationType: string): Promise<SafetyAlert[]> => {
    const alerts = await SafetyAlertsService.getSafetyAlerts();
    return alerts.filter(alert => alert.loai_vi_pham === violationType);
  },

  /**
   * Get safety alerts by location
   * @param location The location to filter by
   * @returns Promise with array of filtered safety alerts
   */
  getAlertsByLocation: async (location: string): Promise<SafetyAlert[]> => {
    const alerts = await SafetyAlertsService.getSafetyAlerts();
    return alerts.filter(alert => alert.khu_vuc.includes(location));
  },

  /**
   * Get safety alerts for a specific camera
   * @param cameraId The camera ID to filter by
   * @returns Promise with array of filtered safety alerts
   */
  getAlertsByCamera: async (cameraId: string): Promise<SafetyAlert[]> => {
    const alerts = await SafetyAlertsService.getSafetyAlerts();
    return alerts.filter(alert => alert.cam_id === cameraId);
  },

  /**
   * Get safety alerts by date range
   * @param startDate Start date in YYYY-MM-DD format
   * @param endDate End date in YYYY-MM-DD format
   * @returns Promise with array of filtered safety alerts
   */
  getAlertsByDateRange: async (startDate: string, endDate: string): Promise<SafetyAlert[]> => {
    const alerts = await SafetyAlertsService.getSafetyAlerts();

    return alerts.filter(alert => {
      const alertDate = alert.timestamp.split(' ')[0]; // Extract YYYY-MM-DD part
      return alertDate >= startDate && alertDate <= endDate;
    });
  },

  /**
   * Get latest safety alerts
   * @param limit Maximum number of alerts to return
   * @returns Promise with array of most recent safety alerts
   */
  getLatestAlerts: async (limit: number = 5): Promise<SafetyAlert[]> => {
    const alerts = await SafetyAlertsService.getSafetyAlerts();

    // Sort by timestamp (most recent first)
    return [...alerts]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  },

  /**
   * Get the most common violation types
   * @returns Promise with object containing violation types and their counts
   */
  getViolationTypeCounts: async (): Promise<{ [type: string]: number }> => {
    const alerts = await SafetyAlertsService.getSafetyAlerts();

    return alerts.reduce((counts, alert) => {
      const type = alert.loai_vi_pham;
      counts[type] = (counts[type] || 0) + 1;
      return counts;
    }, {} as { [type: string]: number });
  }
};

export default SafetyAlertsService;