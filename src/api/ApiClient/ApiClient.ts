import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
if (!baseURL) {
  console.error("API_BASE_URL is not defined in environment variables");
} else {
  console.log(`Using API_BASE_URL: ${baseURL}`);
}

const apiClient = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (process.env.NODE_ENV === 'development') {
      // console.log('Auth Token:', token);
    }
    if (token) {
      config.headers.Authorization = `x-access-token ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

export default apiClient;
