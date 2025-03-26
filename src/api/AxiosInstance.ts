import axios from 'axios';

const AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080', // Make configurable
  headers: {
    'Content-Type': 'application/json',
  },
});

export default AxiosInstance;
