'use client';

import { createAsyncThunk } from '@reduxjs/toolkit';
import { HttpStatus, IAuthSliceState, IUnsafeObject } from '@/shared/types';
import apiClient from '@/store/client/apiClient';
import { FirebaseClient } from '@/lib/firebase/firebaseClient';
import Cookies from 'js-cookie';
import { X_NEXT_TOKEN } from '@/shared/const';

const setAuthTokenToCookie = (accessToken: string) => {
  Cookies.set(X_NEXT_TOKEN, accessToken, {
    expires: 30, // days
    path: process.env.NEXT_PUBLIC_API_URL,
  });
};

const removeAuthTokenFromCookie = () => {
  Cookies.remove(X_NEXT_TOKEN, { path: process.env.NEXT_PUBLIC_API_URL });
};

const getAuthTokenFromCookie = (): string | undefined => {
  try {
    return Cookies.get(X_NEXT_TOKEN);
  } catch (err) {
    return undefined;
  }
};

// region Auth Signin
const authSignin = createAsyncThunk(
  'auth/signin',
  async (payload: IUnsafeObject, thunkAPI) => {
    try {
      const response = await apiClient.request({
        method: 'post',
        url: '/auth/signin',
        data: payload,
      });

      if (
        response?.data?.success &&
        response?.data?.statusCode == HttpStatus.OK
        
      ) {
        const fbCredentials = await FirebaseClient.authWithCustomToken(
          response?.data?.data?.customToken,
        );
        response.data.data = {
          ...response.data.data,
          ...fbCredentials?.user,
        };
      }

      setAuthTokenToCookie(response?.data?.data?.accessToken);
      return response.data;

    } catch (error) {
      console.log('failed auth login', error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);

// region Auth Signup
const authSignup = createAsyncThunk(
  'auth/signup',
  async (payload: IUnsafeObject, thunkAPI) => {
    try {
      const response = await apiClient.request({
        method: 'post',
        url: '/auth/signup',
        data: payload,
      });

      if (response?.data?.success && response?.data?.statusCode == HttpStatus.OK) {
        const fbCredentials = await FirebaseClient.authWithCustomToken(
          response?.data?.data?.customToken,
        );

        response.data.data = {
          ...response.data.data,
          ...fbCredentials?.user,
        };
      }

      setAuthTokenToCookie(response?.data?.data?.accessToken);
      return response.data;

    } catch (error) {
      console.log('failed auth signup', error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);

// region Provider Signin
const authProviderSignin = createAsyncThunk(
  'auth/providerSignin',
  async (providerToken: string, thunkAPI) => {
    try {
      const response = await apiClient.request({
        method: 'post',
        url: '/auth/signin',
        headers: {
          'x-provider-token': providerToken,
        },
      });

      if (
        response?.data?.success &&
        response?.data?.statusCode == HttpStatus.OK
      ) {
        const fbCredentials = await FirebaseClient.authWithCustomToken(
          response?.data?.data?.accessToken,
        );
        response.data.data = {
          ...response.data.data,
          ...fbCredentials?.user,
        };
      }
      setAuthTokenToCookie(response?.data?.data?.accessToken);

      return response.data;
    } catch (error) {
      console.log('failed auth login', error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);

/// region Provider Signup
const authProviderSignup = createAsyncThunk(
  'auth/providerSignup',
  async (providerToken: string, thunkAPI) => {
    try {
      const response = await apiClient.request({
        method: 'post',
        url: '/auth/signup',
        headers: {
          'x-provider-token': providerToken,
        },
      });

      if (
        response?.data?.success &&
        response?.data?.statusCode == HttpStatus.OK
      ) {
        const fbCredentials = await FirebaseClient.authWithCustomToken(
          response?.data?.data?.accessToken,
        );
        response.data.data = {
          ...response.data.data,
          ...fbCredentials?.user,
        };
      }
      setAuthTokenToCookie(response?.data?.data?.accessToken);

      return response.data;
    } catch (error) {
      console.log('failed auth signup', error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);

// region Auth Signout
const authSignout = createAsyncThunk(
  'auth/signout',
  async (_payload, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as { authSlice: IAuthSliceState };
      const accessToken = getAuthTokenFromCookie() ?? '';

      const response = await apiClient.request({
        method: 'get',
        url: '/auth/signout',
        headers: {
          Authorization: `bearer ${accessToken}`,
        },
      });
      removeAuthTokenFromCookie();

      await FirebaseClient.authSignOut();

      return response.data;
    } catch (error) {
      console.log('failed auth logout', error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);

// region Forgot Password
const authSendForgotPasswordEmail = createAsyncThunk(
  'auth/sendForgotPasswordEmail',
  async (email: string, thunkAPI) => {
    try {
      await FirebaseClient.authSendPasswordResetEmail(email);

      return {
        success: true,
        message:
          'Password reset email sent! Please check your inbox to continue with the password reset process.',
      };
    } catch (error) {
      console.log('failed auth forgot password', error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export {
  setAuthTokenToCookie,
  removeAuthTokenFromCookie,
  getAuthTokenFromCookie,
  authSignin,
  authSignup,
  authProviderSignin,
  authProviderSignup,
  authSignout,
  authSendForgotPasswordEmail,
};
