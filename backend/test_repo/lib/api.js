import axios from "axios"

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api" 

const api = axios.create({
    baseURL: BASE_URL, 
    withCredentials:true,
}) 

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Optionally redirect to login
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
 
export default api 
 