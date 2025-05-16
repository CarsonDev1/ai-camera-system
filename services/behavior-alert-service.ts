import api from "@/utils/api";

export interface BehaviorAlert {
  name: string;
  loai_vi_pham: string;
  khu_vuc: string;
  timestamp: string;
  department: string;
  employee_name: string;
  trang_thai: string;
  // Add other fields as needed
}

export interface BehaviorAlertsResponse {
  message: {
    data: BehaviorAlert[];
    total: number;
    page: number;
    page_length: number;
    total_pages: number;
  };
}

const BehaviorAlertService = {
  getBehaviorAlerts: async (
    page: number = 1,
    pageLength: number = 10,
    forceRefresh: boolean = false
  ): Promise<{
    data: BehaviorAlert[],
    total: number,
    page: number,
    page_length: number,
    total_pages: number
  }> => {
    const url = `/method/fire_alarm_app.custom_api.dashboard_api.get_behavior_alerts_with_employee?page=${page}&page_length=${pageLength}`;
    const response = await api.get<BehaviorAlertsResponse>(url, {
      headers: forceRefresh ? {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0'
      } : {}
    });
    return response.data.message;
  }
};

export default BehaviorAlertService;