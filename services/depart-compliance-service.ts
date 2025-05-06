import api from "@/utils/api";

/**
 * Interface for compliance data by department
 */
export interface DepartmentComplianceData {
  department: string;
  compliance_rate: number;
}

/**
 * Interface for the compliance data response
 */
export interface ComplianceResponse {
  message: {
    data: DepartmentComplianceData[];
  }
}

/**
 * Service responsible for fetching compliance-related data
 */
const ComplianceService = {
  /**
   * Get on-time compliance rates by department
   * @returns Promise containing compliance data for each department
   */
  getOnTimeComplianceByDepartment: async (): Promise<DepartmentComplianceData[]> => {
    try {
      const response = await api.get<ComplianceResponse>(
        '/method/fire_alarm_app.custom_api.dashboard_api.get_on_time_compliance_by_department'
      );

      // Return the data array from within the message
      return response.data.message.data;
    } catch (error) {
      console.error('Error fetching compliance data:', error);
      throw error;
    }
  },
};

export default ComplianceService;