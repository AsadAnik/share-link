'use client';

import axios, { AxiosError } from 'axios';
import { IApiResponse } from '@/shared/types';
import { API_BASE_URL } from '@/shared/const';
const DEFAULT_TIMEOUT = 300_000;

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: DEFAULT_TIMEOUT,
    withCredentials: true,
    timeoutErrorMessage:
        'Server took too long to respond. Please try again later.',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use((config) => {
    const abortController = new AbortController();
    setTimeout(() => abortController.abort(), DEFAULT_TIMEOUT + 5000);
    config.signal = abortController.signal;
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        // console.log('request error', error);
        const errors = error as AxiosError<IApiResponse>;
        if (errors?.response?.data) {
            return Promise.reject(errors?.response?.data);
        }
        const statusCode = errors.response?.status || 500;
        const errorData = {
            success: false,
            statusCode,
            data: null,
            error: errors.message,
            message: error?.response?.statusText ?? errors.code,
        } as IApiResponse;
        return Promise.reject(errorData);
    },
);

export default apiClient;
