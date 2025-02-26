import axios from 'axios';
import config from './config';

const buildApiUrl = (url: any) => `${config.protocol}://${config.serverURL}${url}`;
axios.defaults.timeout = 600000;
export const postApi = async (url: string, data: any) => {
  try {
    let apiUrl = buildApiUrl(url);
    const response = await axios.post(apiUrl, data, {
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json'
      }
    });
    return response;
  } catch (error: any) {
    return error;
  }
};

export const postApiWithMultipart = async (
  url: string,
  formData: FormData,
) => {
  try {
    let apiUrl = buildApiUrl(url);
    const response = await axios.post(apiUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        accept: 'application/json',
      },
      responseType: "blob",
    });
    return response;
  } catch (error: any) {
    return error;
  }
};

export const getApi = async (url: string) => {
  try {
    let apiUrl = buildApiUrl(url);
    const response = await axios.get(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json'
      }
    });
    return response;
  } catch (error: any) {
    return error;
  }
};

export const putApi = async (url: string, data: any, multipart = false) => {
  try {
    let apiUrl = buildApiUrl(url);
    const response = await axios.put(apiUrl, data, {
      headers: {
        'Content-Type': multipart ? 'multipart/form-data' : 'application/json',
        accept: 'application/json'
      }
    });
    return response;
  } catch (error: any) {
    return error;
  }
};

export const deleteApi = async (
  url: any,
  token: String | null,
  requestData?: any
) => {
  try {
    let apiUrl = buildApiUrl(url);
    const response = await axios.delete(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        accept: 'application/json'
      },
      data: requestData
    });
    return response;
  } catch (error: any) {
    return error;
  }
};