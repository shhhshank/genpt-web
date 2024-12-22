import axios from 'axios';

const AxiosInstance = axios.create({
  baseURL: 'http://localhost:8080', // Replace with your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default AxiosInstance;
