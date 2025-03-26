import { OptionItem } from '../fragments/Option';
import AxiosInstance from './AxiosInstance';

export type Payload = {
    topic:string,
    contextId:string,
    templateId:string,
    options:OptionItem   
}

export const generatePPT = async (payload: Payload): Promise<string> => {
  const response = await AxiosInstance.post('/generate', payload, {
    responseType: 'blob'  // Set response type to blob
  });
  
  // Create a blob URL from the response data
  const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' });
  return URL.createObjectURL(blob);
};
