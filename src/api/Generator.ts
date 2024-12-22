import { OptionItem } from '../fragments/Option';
import AxiosInstance from './AxiosInstance';

export type Payload = {
    topic:string,
    contextId:string,
    templateId:string,
    options:OptionItem   
}

export const generatePPT = async (payload: Payload): Promise<string> => {
  const response = await AxiosInstance.post('/generate', payload);
  return response.data.url; // Assuming the response contains a success message
};
