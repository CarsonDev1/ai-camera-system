import api from "@/utils/api";

export interface Employee {
  employee_name: string;
  gender: string;
  date_of_joining: string;
  custom_face_images: string | null;
  custom_face_images1: string | null;
  custom_face_images2: string | null;
  custom_face_images3: string | null;
  department: string;
  designation: string;
  employment_type: string;
  status: string;
}

export interface EmployeeResponse {
  data: Employee[];
}

const EmployeeService = {
  getEmployees: async (): Promise<Employee[]> => {
    const fields = [
      "employee_name",
      "gender",
      "date_of_joining",
      "custom_face_images",
      "custom_face_images1",
      "custom_face_images2",
      "custom_face_images3",
      "department",
      "designation",
      "employment_type",
      "status"
    ];

    const encodedFields = encodeURIComponent(JSON.stringify(fields));
    const url = `/resource/Employee?fields=${encodedFields}`;

    const response = await api.get<EmployeeResponse>(url);
    return response.data.data;
  },

  getEmployeesByDepartment: async (department: string): Promise<Employee[]> => {
    const employees = await EmployeeService.getEmployees();
    return employees.filter(employee => employee.department === department);
  },

  getActiveEmployees: async (): Promise<Employee[]> => {
    const employees = await EmployeeService.getEmployees();
    return employees.filter(employee => employee.status === "Active");
  }
};

export default EmployeeService;