import api from "@/utils/api";

export interface EmployeeData {
  name?: string;
  owner?: string;
  creation?: string;
  modified?: string;
  modified_by?: string;
  docstatus?: number;
  idx?: number;
  employee?: string;
  naming_series?: string;
  first_name: string;
  middle_name?: string | null;
  last_name?: string | null;
  employee_name?: string;
  gender: string;
  date_of_birth: string;
  salutation?: string | null;
  custom_employee_code?: string | null;
  date_of_joining: string;
  image?: string | null;
  status?: string;
  custom_face_images?: string | null;
  custom_face_images1?: string | null;
  custom_face_images2?: string | null;
  custom_face_images3?: string | null;
  user_id?: string | null;
  create_user_permission?: number;
  company?: string;
  department: string;
  employment_type: string;
  employee_number?: string | null;
  designation?: string | null;
  reports_to?: string | null;
  branch?: string | null;
  grade?: string | null;
  job_applicant?: string | null;
  scheduled_confirmation_date?: string | null;
  final_confirmation_date?: string | null;
  contract_end_date?: string | null;
  notice_number_of_days?: number;
  date_of_retirement?: string | null;
  cell_number: string;
  personal_email: string;
  company_email?: string | null;
  prefered_contact_email?: string;
  prefered_email?: string | null;
  unsubscribed?: number;
  current_address: string;
  current_accommodation_type?: string;
  permanent_address?: string | null;
  permanent_accommodation_type?: string;
  person_to_be_contacted?: string | null;
  emergency_phone_number?: string | null;
  relation?: string | null;
  attendance_device_id?: string | null;
  holiday_list?: string | null;
  default_shift?: string | null;
  expense_approver?: string | null;
  leave_approver?: string | null;
  shift_request_approver?: string | null;
  ctc?: number;
  salary_currency?: string;
  salary_mode?: string;
  payroll_cost_center?: string | null;
  bank_name?: string | null;
  bank_ac_no?: string | null;
  iban?: string | null;
  marital_status?: string;
  family_background?: string | null;
  blood_group?: string;
  health_details?: string | null;
  health_insurance_provider?: string | null;
  health_insurance_no?: string | null;
  passport_number?: string | null;
  valid_upto?: string | null;
  date_of_issue?: string | null;
  place_of_issue?: string | null;
  bio?: string | null;
  resignation_letter_date?: string | null;
  relieving_date?: string | null;
  held_on?: string | null;
  new_workplace?: string | null;
  leave_encashed?: string;
  encashment_date?: string | null;
  reason_for_leaving?: string | null;
  feedback?: string | null;
  lft?: number;
  rgt?: number;
  old_parent?: string;
}

export interface EmployeeResponse {
  message: EmployeeData;
}

export interface Employee {
  name: string;
  employee_name: string;
  gender: string;
  date_of_joining: string;
  custom_face_images: string | null;
  custom_face_images1: string | null;
  custom_face_images2: string | null;
  custom_face_images3: string | null;
  department: string;
  designation: string | null;
  employment_type: string;
  status: string;
}

export interface EmployeeListResponse {
  data: Employee[];
}

const EmployeeService = {
  getEmployees: async (): Promise<Employee[]> => {
    const fields = [
      "name",
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

    const response = await api.get<EmployeeListResponse>(url);
    return response.data.data;
  },
};

export default EmployeeService;