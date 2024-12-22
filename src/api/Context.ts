import AxiosInstance from './AxiosInstance';
import { Context } from '../types/Context';

export const getContexts = async (): Promise<Context[]> => {
  const response = await AxiosInstance.get('/context/get');
  return response.data;
};

export const getContextById = async (id: string): Promise<Context> => {
  const response = await AxiosInstance.get(`/context/get/${id}`);
  return response.data;
};

export const createContext = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await AxiosInstance.post('/context/create', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.id;
};
