import api from "@/utils/api";

export interface GenderData {
  name: string;
}

export interface GendersResponse {
  data: GenderData[];
}

const GenderService = {
  getAllGenders: async (): Promise<GenderData[]> => {
    const response = await api.get<GendersResponse>('/resource/Gender?fields=["*"]');
    return response.data.data;
  },
};

export default GenderService;