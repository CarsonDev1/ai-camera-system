import axios from 'axios';

const api = axios.create({
  baseURL: 'https://dev4.tadalabs.vn/api',
  headers: {
    'Content-Type': 'application/json',
    "X-Ngrok-Skip-Browser-Warning": '1',
  },
});

api.interceptors.request.use((config) => {
  const token = 'token a6b73e5e5d8b4f4:87aaa4e073c8b9f';
  config.headers['Authorization'] = `token a6b73e5e5d8b4f4:87aaa4e073c8b9f
`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log('Error in interceptor:', error.response?.status);
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      try {
        const response = await axios.post('/auth/refresh', { token: refreshToken });
        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
