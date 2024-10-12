'use client';

import { ThunkDispatch } from '@reduxjs/toolkit';
import { BaseQueryFn } from '@reduxjs/toolkit/query/react';
import { AxiosRequestConfig } from 'axios';
import { authAction } from '@/store';
import { IApiResponse, IAuthSliceState } from '@/shared/types';
import apiClient from './apiClient';
import { getAuthTokenFromCookie } from '@/store/actions';

export interface IBaseQueryApi {
  signal: AbortSignal;
  dispatch: ThunkDispatch<any, any, any>;
  getState: () => unknown;
}

export const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: '' },
  ): BaseQueryFn<
    {
      url: string;
      method?: AxiosRequestConfig['method'];
      data?: AxiosRequestConfig['data'];
      params?: AxiosRequestConfig['params'];
      headers?: AxiosRequestConfig['headers'];
      extraConfig?: AxiosRequestConfig;
    },
    unknown,
    IApiResponse
  > =>
  async (
    { url, method, data, params, headers, extraConfig },
    api: IBaseQueryApi,
  ) => {
    try {
      const state = api.getState() as { authSlice: IAuthSliceState };
      // const accessToken = state?.authSlice?.user?.accessToken || getAuthTokenFromCookie();
      const accessToken = getAuthTokenFromCookie();

      console.log('The TOKEN that needed and the baseURL = ', { accessToken, baseUrl: baseUrl + url });

      headers = {
        ...headers,
        Authorization: `bearer ${accessToken}`,
      };

      const result = await apiClient.request({
        url: baseUrl + url,
        method,
        data,
        params,
        headers,
        ...extraConfig,
      });

      return { data: result?.data };

    } catch (errors) {
      const error = errors as IApiResponse;
      // console.log('axiosBaseQuery', error);
      if (error?.statusCode === 401) {
        console.log('auth.......');
        error.message = 'Something was wrong.Try again.';
        api.dispatch(authAction.refreshAuth(true));
      }
      return {
        error,
      };
    }
  };
