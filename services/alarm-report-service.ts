import api from "@/utils/api";

export interface AlarmReportData {
  name: string;
  cam_id: string | null;
  khu_vuc: string | null;
  timestamp: string;
  trang_thai: "Chưa xử lý" | "Đang xử lý" | "Đã xử lý";
  alarm_type: "Xâm Nhập Trái Phép" | "Hành Vi Vi Phạm" | "An Toàn Lao Động";
  loai_vi_pham: string;
  custom_employee: string | null;
  image?: string;
}

export interface AlarmReportResponse {
  data: AlarmReportData[];
}

export interface PaginatedAlarmReportResponse {
  data: AlarmReportData[];
  message?: string;
  total_count?: number;
}

export interface AlertTypeDistributionItem {
  alarm_type: string;
  count: number;
  percent: number;
}

export interface AlertTypeDistributionResponse {
  message: {
    message: {
      total_alerts: number;
      data: AlertTypeDistributionItem[];
    }
  }
}

const AlarmReportService = {
  /**
   * Get all alarm reports - no pagination
   */
  getAllAlarmReports: async (): Promise<AlarmReportData[]> => {
    const response = await api.get<AlarmReportResponse>(
      '/resource/Alarm%20Report?fields=["name","cam_id","khu_vuc","timestamp","trang_thai","alarm_type","loai_vi_pham","custom_employee"]&order_by=timestamp desc'
    );
    return response.data.data;
  },

  /**
   * Get paginated alarm reports
   * @param page Page number (1-based index)
   * @param pageSize Number of items per page
   * @returns Paginated alarm report data
   */
  getPaginatedAlarmReports: async (
    page: number = 1,
    pageSize: number = 10
  ): Promise<{
    data: AlarmReportData[];
    totalCount: number;
  }> => {
    // Calculate the limit_start (0-based index)
    const limitStart = (page - 1) * pageSize;

    // Construct the URL with pagination parameters
    const url = `/resource/Alarm%20Report?fields=["name","alarm_type","cam_id","khu_vuc","timestamp","loai_vi_pham","trang_thai","image","custom_employee"]&limit_page_length=${pageSize}&limit_start=${limitStart}&order_by=timestamp%20desc`;

    try {
      // First request to get the paginated data
      const response = await api.get<PaginatedAlarmReportResponse>(url);

      // Second request to get the total count of records (only needed once)
      // We could cache this value to avoid repeated calls
      const countUrl = '/resource/Alarm%20Report?fields=["name"]&limit_page_length=1';
      const countResponse = await api.get<PaginatedAlarmReportResponse>(countUrl);

      // The total_count field is in the response in some API implementations
      // If not available directly, we try to extract it from the response
      const totalCount = countResponse.data.total_count || 0;

      return {
        data: response.data.data,
        totalCount: totalCount
      };
    } catch (error) {
      console.error("Error fetching paginated alarm reports:", error);
      throw error;
    }
  },

  /**
   * Update the status of an alarm report
   * @param alarmName The name/ID of the alarm report
   * @param status The new status to set
   */
  updateAlarmStatus: async (
    alarmName: string,
    status: "Chưa xử lý" | "Đang xử lý" | "Đã xử lý"
  ): Promise<void> => {
    await api.put(`/resource/Alarm Report/${alarmName}`, {
      trang_thai: status
    });
  },

  /**
   * Get the distribution of alarm reports by alert type
   */
  getAlertTypeDistribution: async (): Promise<{
    total_alerts: number;
    data: AlertTypeDistributionItem[];
  }> => {
    const response = await api.get<AlertTypeDistributionResponse>(
      '/method/fire_alarm_app.custom_api.dashboard_api.get_alert_type_distribution'
    );

    // Return the processed data
    return response.data.message.message;
  }
};

export default AlarmReportService;