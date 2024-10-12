'use client';

import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@/store/client/apiBaseQuery';
import { IApiResponse, IUserProfile } from '@/shared/types';
import { ToastSuccessMessage, ToastErrorMessage } from '@/components/wrappers/ToastWraper';


export const ProfileSlice = createApi({
    reducerPath: 'profileSlice',
    baseQuery: axiosBaseQuery({
        baseUrl: '',
    }),
    tagTypes: ['Profile', 'PublicProfile'],
    endpoints(build) {
        return {
            // #region Get Profile (Me)
            getProfile: build.query<IUserProfile, void>({
                query: (payload: any) => {
                    return {
                        url: '/user',
                        method: 'GET',
                        headers: {
                            accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                        params: payload,
                    };
                },
                transformResponse: async (response: IApiResponse, _meta, _arg) => {
                    const responseData = response?.data as IUserProfile;
                    return responseData;
                },
                transformErrorResponse: (response: IApiResponse, _meta, _arg) => {
                    return response;
                },
                forceRefetch({ currentArg, previousArg }) {
                    return currentArg !== previousArg;
                },
                providesTags: ['Profile'],
            }),

            // #region Update Profile
            updateProfileForm: build.mutation({
                query: (payload) => {
                    return {
                        url: '/user',
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
                            title: 'Profile Success',
                            message: response?.message as string,
                        });
                    }
                    return response?.data;
                },
                transformErrorResponse: (response: IApiResponse, _meta, _arg) => {
                    if (!response?.success) {
                        ToastErrorMessage({
                            title: 'Profile Error',
                            message: response?.message as string,
                        });
                    }
                    return response?.data;
                },
                invalidatesTags: ['Profile'],
            }),

            // #region Update Profile Picture
            updateProfilePicture: build.mutation({
                query: (payload) => {
                    return {
                        url: '/user',
                        method: 'PATCH',
                        headers: {
                            accept: 'application/json',
                            'Content-Type': 'multipart/form-data',
                        },
                        data: payload,
                    };
                },
                transformResponse: async (response: IApiResponse, _meta, _arg) => {
                    if (response?.success) {
                        ToastSuccessMessage({
                            title: 'Profile Success',
                            message: response?.message as string,
                        });
                    }
                    return response?.data;
                },
                transformErrorResponse: (response: IApiResponse, _meta, _arg) => {
                    if (!response?.success) {
                        ToastErrorMessage({
                            title: 'Profile Error',
                            message: response?.message as string,
                        });
                    }
                    return response?.data;
                },
                invalidatesTags: ['Profile'],
            }),
        };
    },
});

export const {
    useGetProfileQuery,
    useUpdateProfileFormMutation,
    useUpdateProfilePictureMutation,
} = ProfileSlice;
