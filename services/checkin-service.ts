import api from "@/utils/api";

export interface EmployeeCheckinRecord {
  name: string;
  employee: string;
  employee_name: string;
  log_type: "IN" | "OUT";
  time: string;
  custom_late_by: number | null;
  custom_early_by: number | null;
}

export interface EmployeeCheckinResponse {
  data: EmployeeCheckinRecord[];
}

export interface AccessRecordFormatted {
  id: string;
  name: string;
  employeeId: string;
  department: string;
  time: string;
  location: string;
  direction: "in" | "out";
  method: string;
}

const EmployeeCheckinService = {
  getEmployeeCheckins: async (
    limitStart: number = 0,
    limitPageLength: number = 10,
    filters: Record<string, any> = {}
  ): Promise<EmployeeCheckinRecord[]> => {
    const fields = [
      "name",
      "employee",
      "employee_name",
      "log_type",
      "time",
      "custom_late_by",
      "custom_early_by"
    ];

    const fieldsParam = encodeURIComponent(`[${fields.map(field => `"${field}"`).join(",")}]`);
    let url = `/resource/Employee%20Checkin?fields=${fieldsParam}&limit_page_length=${limitPageLength}&limit_start=${limitStart}`;

    // Add any additional filters
    if (Object.keys(filters).length > 0) {
      const filtersParam = encodeURIComponent(JSON.stringify(filters));
      url += `&filters=${filtersParam}`;
    }

    const response = await api.get<EmployeeCheckinResponse>(url);
    return response.data.data;
  },

  // Format the raw checkin data to match the access records format
  formatCheckinToAccessRecord: (checkin: EmployeeCheckinRecord): AccessRecordFormatted => {
    // Extract employee ID from the format "HR-EMP-00001" to "NV001"
    const employeeIdMatch = checkin.employee.match(/\d+/);
    const employeeIdNumber = employeeIdMatch ? employeeIdMatch[0] : '000';
    const formattedEmployeeId = `NV${employeeIdNumber.padStart(3, '0')}`;

    // Format the time from "2025-05-17 21:15:33" to "17/05/2025 21:15"
    const dateObj = new Date(checkin.time);
    const formattedTime = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getFullYear()} ${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}`;

    // Determine department based on employee ID (for demo purposes)
    const departments = ["Sản xuất", "Kỹ thuật", "Bảo trì", "Nhân sự", "Quản lý"];
    const departmentIndex = parseInt(employeeIdNumber) % departments.length;
    const department = departments[departmentIndex];

    // Determine location (for demo purposes)
    const locations = ["Cổng chính", "Cổng nhân viên", "Cổng kho hàng", "Cổng phụ"];
    const locationIndex = parseInt(employeeIdNumber) % locations.length;
    const location = locations[locationIndex];

    // Determine authentication method (for demo purposes)
    const methods = ["Khuôn mặt", "Vân tay", "Thẻ từ"];
    const methodIndex = parseInt(employeeIdNumber) % methods.length;
    const method = methods[methodIndex];

    return {
      id: checkin.name,
      name: checkin.employee_name,
      employeeId: formattedEmployeeId,
      department: department,
      time: formattedTime,
      location: location,
      direction: checkin.log_type === "IN" ? "in" : "out",
      method: method
    };
  },

  getFormattedAccessRecords: async (
    limitStart: number = 0,
    limitPageLength: number = 10,
    filters: Record<string, any> = {}
  ): Promise<AccessRecordFormatted[]> => {
    const checkins = await EmployeeCheckinService.getEmployeeCheckins(limitStart, limitPageLength, filters);
    return checkins.map(checkin => EmployeeCheckinService.formatCheckinToAccessRecord(checkin));
  }
};

export default EmployeeCheckinService;