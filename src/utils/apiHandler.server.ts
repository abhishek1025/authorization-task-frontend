'use server';

import AxiosInstanceNew from '@/config/axiosConfig';
import { ApiHandlerParams } from '@/interface';
import { getTokenFromCookieServer } from './cookieHandler.server';

export const serverGetRequest = async (params: ApiHandlerParams) => {
  const token = await getTokenFromCookieServer();

  const axiosInstance = new AxiosInstanceNew(token);

  return axiosInstance.createRequest('get', params.endpoint);
};

