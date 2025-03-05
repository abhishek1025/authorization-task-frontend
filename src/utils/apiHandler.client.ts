'use client';

import { getAuthTokenFromCookie } from '@/utils/cookieHandler.client';
import AxiosInstanceNew from '@/config/axiosConfig';
import { ApiHandlerParams } from '@/interface';

const axiosInstance = new AxiosInstanceNew(getAuthTokenFromCookie() ?? '');

export const clientGetRequest = (params: ApiHandlerParams) => {
  return axiosInstance.createRequest('get', params.endpoint);
};

export const clientPostRequest = (params: ApiHandlerParams) => {
  return axiosInstance.createRequest('post', params.endpoint, params.data);
};

export const clientPatchRequest = (params: ApiHandlerParams) => {
  return axiosInstance.createRequest('patch', params.endpoint, params.data);
};

export const clientDeleteRequest = (params: ApiHandlerParams) => {
  return axiosInstance.createRequest('delete', params.endpoint, params.data);
};

export const clientPutRequest = (params: ApiHandlerParams) => {
  return axiosInstance.createRequest('put', params.endpoint, params.data);
};

