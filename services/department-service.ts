import api from "@/utils/api";

export interface DepartmentData {
  name: string;
}

export interface DepartmentsResponse {
  data: DepartmentData[];
}

const DepartmentService = {
  getAllDepartments: async (): Promise<DepartmentData[]> => {
    const response = await api.get<DepartmentsResponse>('/resource/Department?fields=["*"]');
    return response.data.data;
  },
};

export default DepartmentService;