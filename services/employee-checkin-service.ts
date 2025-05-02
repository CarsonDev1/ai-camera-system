import api from "@/utils/api";

export interface EmployeeCheckin {
  name: string;
  employee: string;
  employee_name: string;
  log_type: "IN" | "OUT";
  time: string;
  custom_late_by: number | null;
  custom_early_by: number | null;
}

export interface EmployeeCheckinResponse {
  data: EmployeeCheckin[];
}

const EmployeeCheckinService = {
  getEmployeeCheckins: async (): Promise<EmployeeCheckin[]> => {
    const fields = [
      "name",
      "employee",
      "employee_name",
      "log_type",
      "time",
      "custom_late_by",
      "custom_early_by"
    ];

    const encodedFields = encodeURIComponent(JSON.stringify(fields));
    const url = `/resource/Employee Checkin?fields=${encodedFields}&limit_page_length=100000`;

    const response = await api.get<EmployeeCheckinResponse>(url);
    return response.data.data;
  },

  getCheckinsByEmployee: async (employeeId: string): Promise<EmployeeCheckin[]> => {
    const checkins = await EmployeeCheckinService.getEmployeeCheckins();
    return checkins.filter(checkin => checkin.employee === employeeId);
  },

  getLatestCheckins: async (limit: number = 10): Promise<EmployeeCheckin[]> => {
    const checkins = await EmployeeCheckinService.getEmployeeCheckins();
    return [...checkins]
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, limit);
  },

  // Helper method to get matched IN/OUT pairs for attendance analysis
  getCheckinPairs: async (): Promise<{ in: EmployeeCheckin, out: EmployeeCheckin }[]> => {
    const checkins = await EmployeeCheckinService.getEmployeeCheckins();
    const pairs: { in: EmployeeCheckin, out: EmployeeCheckin }[] = [];

    // Group checkins by employee and date (ignoring time)
    const groupedCheckins = new Map<string, EmployeeCheckin[]>();

    checkins.forEach(checkin => {
      const date = checkin.time.split(' ')[0];
      const key = `${checkin.employee}-${date}`;

      if (!groupedCheckins.has(key)) {
        groupedCheckins.set(key, []);
      }

      groupedCheckins.get(key)?.push(checkin);
    });

    // Find IN/OUT pairs for each employee per day
    groupedCheckins.forEach(employeeCheckins => {
      const inCheckins = employeeCheckins.filter(c => c.log_type === "IN");
      const outCheckins = employeeCheckins.filter(c => c.log_type === "OUT");

      // Sort by time
      inCheckins.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
      outCheckins.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

      // Match pairs - simplest algorithm: match first IN with first OUT, then second IN with second OUT, etc.
      for (let i = 0; i < Math.min(inCheckins.length, outCheckins.length); i++) {
        pairs.push({
          in: inCheckins[i],
          out: outCheckins[i]
        });
      }
    });

    return pairs;
  },

  // Get employees with late check-ins
  getLateCheckins: async (): Promise<EmployeeCheckin[]> => {
    const checkins = await EmployeeCheckinService.getEmployeeCheckins();
    return checkins.filter(checkin =>
      checkin.log_type === "IN" &&
      checkin.custom_late_by !== null &&
      checkin.custom_late_by > 0
    );
  },

  // Get employees with early check-outs
  getEarlyCheckouts: async (): Promise<EmployeeCheckin[]> => {
    const checkins = await EmployeeCheckinService.getEmployeeCheckins();
    return checkins.filter(checkin =>
      checkin.log_type === "OUT" &&
      checkin.custom_early_by !== null &&
      checkin.custom_early_by > 0
    );
  }
};

export default EmployeeCheckinService;