import api from "@/utils/api";

export interface BehaviorAlert {
  name: string;
  employee: string | null;
  cam_id: string;
  khu_vuc: string | null;
  timestamp: string;
  loai_vi_pham: string;
  trang_thai: string;
  image: string | null;
  employee_name: string;
  department: string;
}

export interface BehaviorAlertsResponse {
  message: {
    data: BehaviorAlert[];
  };
}

const BehaviorAlertsService = {
  /**
   * Fetch all behavior alerts from the API
   * @returns Promise with array of behavior alerts
   */
  getBehaviorAlerts: async (p0: number, p1: number, p2: boolean): Promise<BehaviorAlert[]> => {
    const response = await api.get<BehaviorAlertsResponse>('/method/fire_alarm_app.custom_api.dashboard_api.get_behavior_alerts_with_employee');
    return response.data.message.data;
  },

  /**
   * Get pending behavior alerts (not yet handled)
   * @returns Promise with array of pending behavior alerts
   */
  getPendingBehaviorAlerts: async (): Promise<BehaviorAlert[]> => {
    const alerts = await BehaviorAlertsService.getBehaviorAlerts();
    return alerts.filter(alert => alert.trang_thai === "Chưa xử lý");
  },

  /**
   * Get resolved behavior alerts
   * @returns Promise with array of resolved behavior alerts
   */
  getResolvedBehaviorAlerts: async (): Promise<BehaviorAlert[]> => {
    const alerts = await BehaviorAlertsService.getBehaviorAlerts();
    return alerts.filter(alert => alert.trang_thai === "Đã xử lý");
  },

  /**
   * Get behavior alerts by violation type
   * @param violationType The violation type to filter by
   * @returns Promise with array of filtered behavior alerts
   */
  getAlertsByViolationType: async (violationType: string): Promise<BehaviorAlert[]> => {
    const alerts = await BehaviorAlertsService.getBehaviorAlerts();
    return alerts.filter(alert => alert.loai_vi_pham === violationType);
  },

  /**
   * Get behavior alerts associated with a specific employee
   * @param employeeId The employee ID to filter by
   * @returns Promise with array of filtered behavior alerts
   */
  getAlertsByEmployee: async (employeeId: string): Promise<BehaviorAlert[]> => {
    const alerts = await BehaviorAlertsService.getBehaviorAlerts();
    return alerts.filter(alert => alert.employee === employeeId);
  },

  /**
   * Get behavior alerts by camera ID
   * @param cameraId The camera ID to filter by
   * @returns Promise with array of filtered behavior alerts
   */
  getAlertsByCamera: async (cameraId: string): Promise<BehaviorAlert[]> => {
    const alerts = await BehaviorAlertsService.getBehaviorAlerts();
    return alerts.filter(alert => alert.cam_id === cameraId);
  },

  /**
   * Get behavior alerts by location/area
   * @param area The area to filter by
   * @returns Promise with array of filtered behavior alerts
   */
  getAlertsByArea: async (area: string): Promise<BehaviorAlert[]> => {
    const alerts = await BehaviorAlertsService.getBehaviorAlerts();
    return alerts.filter(alert => alert.khu_vuc && alert.khu_vuc.includes(area));
  },

  /**
   * Get behavior alerts by date range
   * @param startDate Start date in YYYY-MM-DD format
   * @param endDate End date in YYYY-MM-DD format
   * @returns Promise with array of filtered behavior alerts
   */
  getAlertsByDateRange: async (startDate: string, endDate: string): Promise<BehaviorAlert[]> => {
    const alerts = await BehaviorAlertsService.getBehaviorAlerts();

    return alerts.filter(alert => {
      const alertDate = alert.timestamp.split(' ')[0];
      return alertDate >= startDate && alertDate <= endDate;
    });
  },

  /**
   * Get the most recent behavior alerts
   * @param limit Maximum number of alerts to return
   * @returns Promise with array of most recent behavior alerts
   */
  getLatestAlerts: async (limit: number = 5): Promise<BehaviorAlert[]> => {
    const alerts = await BehaviorAlertsService.getBehaviorAlerts();

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
    const alerts = await BehaviorAlertsService.getBehaviorAlerts();

    return alerts.reduce((counts, alert) => {
      const type = alert.loai_vi_pham;
      counts[type] = (counts[type] || 0) + 1;
      return counts;
    }, {} as { [type: string]: number });
  },

  /**
   * Get departments with most violations
   * @returns Promise with object containing departments and their violation counts
   */
  getDepartmentViolationCounts: async (): Promise<{ [department: string]: number }> => {
    const alerts = await BehaviorAlertsService.getBehaviorAlerts();

    return alerts.reduce((counts, alert) => {
      if (alert.department) {
        counts[alert.department] = (counts[alert.department] || 0) + 1;
      }
      return counts;
    }, {} as { [department: string]: number });
  }
};

export default BehaviorAlertsService;