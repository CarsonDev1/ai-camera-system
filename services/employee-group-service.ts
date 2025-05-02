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

const EmployeeGroupsService = {
  getEmployeeGroups: async (): Promise<EmployeeGroup[]> => {
    const response = await api.get<EmployeeGroupsResponse>('/method/fire_alarm_app.custom_api.dashboard_api.get_employee_groups');
    return response.data.message;
  }
};

export default EmployeeGroupsService;