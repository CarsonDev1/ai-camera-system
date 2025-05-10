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
}

export interface AlarmReportResponse {
  data: AlarmReportData[];
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
  getAllAlarmReports: async (): Promise<AlarmReportData[]> => {
    const response = await api.get<AlarmReportResponse>(
      '/resource/Alarm%20Report?fields=["name","cam_id","khu_vuc","timestamp","trang_thai","alarm_type","loai_vi_pham","custom_employee"]&order_by=timestamp desc'
    );
    return response.data.data;
  },

  updateAlarmStatus: async (
    alarmName: string,
    status: "Chưa xử lý" | "Đang xử lý" | "Đã xử lý"
  ): Promise<void> => {
    await api.put(`/resource/Alarm Report/${alarmName}`, {
      trang_thai: status
    });
  },

  getAlertTypeDistribution: async (): Promise<{
    total_alerts: number;
    data: AlertTypeDistributionItem[];
  }> => {
    const response = await api.get<AlertTypeDistributionResponse>(
      '/method/fire_alarm_app.custom_api.dashboard_api.get_alert_type_distribution'
    );

    // Trả về dữ liệu đã được xử lý qua các lớp lồng nhau
    return response.data.message.message;
  }
};

export default AlarmReportService;