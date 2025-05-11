import api from "@/utils/api";

export interface EmployeeGroup {
  group_name: string;
  description: string;
  member_count: number;
  created_date: string;
}

export interface EmployeeGroupsResponse {
  message: EmployeeGroup[];
}

export interface CreateDepartmentRequest {
  department_name: string;
}

export interface Department {
  department_name: string;
  // Thêm các fields khác nếu API trả về
}

export interface CreateDepartmentResponse {
  message: Department;
}

const EmployeeGroupsService = {
  getEmployeeGroups: async (): Promise<EmployeeGroup[]> => {
    const response = await api.get<EmployeeGroupsResponse>('/method/fire_alarm_app.custom_api.dashboard_api.get_employee_groups');
    return response.data.message;
  },

  createDepartment: async (data: CreateDepartmentRequest): Promise<Department> => {
    const response = await api.post<CreateDepartmentResponse>('/resource/Department', data);
    return response.data.message;
  }
};

export default EmployeeGroupsService;