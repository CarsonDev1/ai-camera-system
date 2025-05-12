import api from "@/utils/api";

export interface DeviceIdData {
  device_id: string;
  location_name: string;
}

export interface UniqueDeviceIdsData {
  device_ids: DeviceIdData[];
}

export interface UniqueDeviceIdsResponse {
  message: {
    message: UniqueDeviceIdsData;
  };
}

const DeviceService = {
  getUniqueDeviceIds: async (): Promise<UniqueDeviceIdsData> => {
    const response = await api.get<UniqueDeviceIdsResponse>('/method/fire_alarm_app.custom_api.dashboard_api.get_unique_device_ids');
    return response.data.message.message;
  }
};

export default DeviceService;