import AxiosInstance from './AxiosInstance';
import { Template } from '../types/Template';

export const getTemplates = async (): Promise<Template[]> => {
  const response = await AxiosInstance.get('/template/get');
  return response.data;
};

export const getTemplateById = async (id: string): Promise<Template> => {
  const response = await AxiosInstance.get(`/template/get/${id}`);
  return response.data;
};

export const createTemplate = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await AxiosInstance.post('/template/create', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.id;
};
