import api from "@/utils/api";

export interface DepartmentData {
  name: string;
  department_name?: string; // Added to match the PUT request format
}

export interface DepartmentsResponse {
  data: DepartmentData[];
}

export interface DepartmentUpdateResponse {
  data: {
    name: string;
  };
  message?: string;
}

const DepartmentService = {
  getAllDepartments: async (): Promise<DepartmentData[]> => {
    const response = await api.get<DepartmentsResponse>('/resource/Department?fields=["*"]');
    return response.data.data;
  },

  updateDepartment: async (name: string, departmentData: { department_name: string }): Promise<DepartmentUpdateResponse> => {
    const response = await api.put<DepartmentUpdateResponse>(`/resource/Department/${name}`, departmentData);
    return response.data;
  },

  createDepartment: async (departmentData: { department_name: string }): Promise<DepartmentUpdateResponse> => {
    const response = await api.post<DepartmentUpdateResponse>('/resource/Department', departmentData);
    return response.data;
  },

  deleteDepartment: async (name: string): Promise<void> => {
    await api.delete(`/resource/Department/${name}`);
    // Invalidate query cache để cập nhật danh sách
  },
};

export default DepartmentService;