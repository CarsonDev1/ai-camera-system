import api from "@/utils/api";
import { useQueryClient } from "@tanstack/react-query";

export interface EmployeeData {
  first_name: string;
  gender: string;
  date_of_joining: string;
  date_of_birth: string;
  department: string;
  employment_type: string;
  cell_number: string;
  personal_email: string;
  current_address: string;
  custom_face_images1?: any;
  custom_face_images2?: any;
  custom_face_images3?: any;
  custom_face_images4?: any;
  custom_face_images5?: any;
  custom_face_images6?: any;
}

export interface EmployeeResponse {
  message: EmployeeData;
}

// Tạo hook để sử dụng với các component
export const useEmployeeService = () => {
  const queryClient = useQueryClient();

  return {
    getEmployeeByName: async (name: string): Promise<EmployeeData> => {
      const response = await api.get<any>(`/resource/Employee/${name}`);
      return response.data.data;
    },

    createEmployee: async (employeeData: EmployeeData): Promise<EmployeeData> => {
      const response = await api.post<EmployeeResponse>('/resource/Employee', employeeData);
      // Invalidate query cache để cập nhật danh sách
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      return response.data.message;
    },

    updateEmployee: async (name: string, employeeData: EmployeeData): Promise<EmployeeData> => {
      const response = await api.put<EmployeeResponse>(`/resource/Employee/${name}`, employeeData);
      // Invalidate query cache để cập nhật danh sách
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      return response.data.message;
    },

    deleteEmployee: async (name: string): Promise<void> => {
      await api.delete(`/resource/Employee/${name}`);
      // Invalidate query cache để cập nhật danh sách
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  };
};

// Giữ nguyên object cũ để backward compatibility
const EmployeeServiceAction = {
  getEmployeeByName: async (name: string): Promise<EmployeeData> => {
    const response = await api.get<EmployeeResponse>(`/resource/Employee/${name}`);
    return response.data.message;
  },

  createEmployee: async (employeeData: EmployeeData): Promise<EmployeeData> => {
    const response = await api.post<EmployeeResponse>('/resource/Employee', employeeData);
    return response.data.message;
  },

  updateEmployee: async (name: string, employeeData: EmployeeData): Promise<EmployeeData> => {
    const response = await api.put<EmployeeResponse>(`/resource/Employee/${name}`, employeeData);
    return response.data.message;
  },

  deleteEmployee: async (name: string): Promise<void> => {
    await api.delete(`/resource/Employee/${name}`);
  },
};

export default EmployeeServiceAction;