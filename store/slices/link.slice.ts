'use client';

import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@/store/client/apiBaseQuery';
import { IApiResponse, ILink } from '@/shared/types';
import { ToastSuccessMessage, ToastErrorMessage } from '@/components/wrappers/ToastWraper';


export const LinkSlice = createApi({
    reducerPath: 'linkSlice',
    baseQuery: axiosBaseQuery({
        baseUrl: '',
    }),
    tagTypes: ['Link'],
    endpoints(build) {
        return {
            // #region Get Links (My)
            getLinks: build.query<ILink[], void>({
                query: (payload: any) => {
                    return {
                        url: '/link',
                        method: 'GET',
                        headers: {
                            accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                        params: payload,
                    };
                },
                transformResponse: async (response: IApiResponse, _meta, _arg) => {
                    const responseData = response?.data as ILink[];
                    return responseData;
                },
                transformErrorResponse: (response: IApiResponse, _meta, _arg) => {
                    return response;
                },
                forceRefetch({ currentArg, previousArg }) {
                    return currentArg !== previousArg;
                },
                providesTags: ['Link'],
            }),

            // #region Create Link
            createLink: build.mutation({
                query: (payload) => {
                    return {
                        url: '/link',
                        method: 'POST',
                        headers: {
                            accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                        data: payload,
                    };
                },
                transformResponse: async (response: IApiResponse, _meta, _arg) => {
                    if (response?.success) {
                        ToastSuccessMessage({
                            title: 'Link Success',
                            message: response?.message as string,
                        });
                    }
                    return response?.data;
                },
                transformErrorResponse: (response: IApiResponse, _meta, _arg) => {
                    if (!response?.success) {
                        ToastErrorMessage({
                            title: 'Link Error',
                            message: response?.message as string,
                        });
                    }
                    return response?.data;
                },
                invalidatesTags: ['Link'],
            }),

            // #region Update Link
            updateLink: build.mutation({
                query: (payload) => {
                    return {
                        url: '/link',
                        method: 'PUT',
                        headers: {
                            accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                        data: payload,
                    };
                },
                transformResponse: async (response: IApiResponse, _meta, _arg) => {
                    if (response?.success) {
                        ToastSuccessMessage({
                            title: 'Link Success',
                            message: response?.message as string,
                        });
                    }
                    return response?.data;
                },
                transformErrorResponse: (response: IApiResponse, _meta, _arg) => {
                    if (!response?.success) {
                        ToastErrorMessage({
                            title: 'Link Error',
                            message: response?.message as string,
                        });
                    }
                    return response?.data;
                },
                invalidatesTags: ['Link'],
            }),

            // #region Delete Link
            removeLink: build.mutation({
                query: (payload) => {
                    return {
                        url: '/link',
                        method: 'DELETE',
                        headers: {
                            accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                        data: payload,
                    };
                },
                transformResponse: async (response: IApiResponse, _meta, _arg) => {
                    if (response?.success) {
                        ToastSuccessMessage({
                            title: 'Link Success',
                            message: response?.message as string,
                        });
                    }
                    return response?.data;
                },
                transformErrorResponse: (response: IApiResponse, _meta, _arg) => {
                    if (!response?.success) {
                        ToastErrorMessage({
                            title: 'Link Error',
                            message: response?.message as string,
                        });
                    }
                    return response?.data;
                },
                invalidatesTags: ['Link'],
            }),
        };
    },
});

export const {
    useGetLinksQuery,
    useCreateLinkMutation,
    useUpdateLinkMutation,
    useRemoveLinkMutation,
} = LinkSlice;
