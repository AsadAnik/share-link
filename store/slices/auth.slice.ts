"use client";

import { createSelector, createSlice } from "@reduxjs/toolkit";
import { IAuthSliceState, IAuthUser, IUnsafeObject } from "@/shared/types";
import { TAppState, useAppDispatch } from "@/store";
import {
  authSignin,
  authSignout,
  authSignup,
  authProviderSignin,
  authProviderSignup,
  authSendForgotPasswordEmail,
  setAuthTokenToCookie,
  removeAuthTokenFromCookie,
  getAuthTokenFromCookie,
} from "@/store/actions";
import { FirebaseClient } from "@/lib/firebase/firebaseClient";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function prepareAuthResponse(userRecord: IUnsafeObject<any>): IAuthUser {
  return {
    uid: userRecord?.uid,
    displayName: userRecord?.name ?? userRecord?.displayName,
    email: userRecord?.email,
    photoUrl: userRecord?.picture ?? userRecord?.photoURL,
    emailVerified: userRecord?.email_verified ?? userRecord?.emailVerified,
    tokenExpireAt:
      userRecord?.exp ?? userRecord?.stsTokenManager?.expirationTime,
    accessToken: userRecord?.customToken ?? userRecord?.accessToken,
  };
}

const AuthSliceName = "authSlice";

const initialState: IAuthSliceState = {
  user: null,
  isLoading: false,
  result: null,
};

export const AuthSlice = createSlice({
  name: AuthSliceName,
  initialState,
  reducers: {
    logout(state, action) {
      console.log(action);
      state.user = null;
    },
    refreshAuth(state, action) {
      FirebaseClient.auth.onAuthStateChanged(async (authUser) => {
        if (authUser?.uid) {
          const newToken = await authUser.getIdTokenResult();
          setAuthTokenToCookie(newToken.token);
          state.user = {
            ...(state.user ?? {}),
            accessToken: newToken.token,
          } as IAuthUser;
          state.isLoading = action.payload ?? true;
        }
      });
    },
    reset(state, action) {
      if (action?.payload?.result) {
        state.result = null;
      }
      if (action?.payload?.user) {
        state.result = null;
      }
      if (action?.payload?.isLoading) {
        state.isLoading = false;
      }
    },
    updateUser(state, action) {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    // login action
    builder.addCase(authSignin.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(authSignin.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload?.data;
      state.result = { ...action.payload, redirectTo: "/" };
    });
    builder.addCase(authSignin.rejected, (state, action) => {
      state.isLoading = false;
      state.result = action.payload as IUnsafeObject;
      state.user = null;
    });

    // login provider action
    builder.addCase(authProviderSignin.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(authProviderSignin.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload?.data;
      state.result = { ...action.payload, redirectTo: "/" };
    });
    builder.addCase(authProviderSignin.rejected, (state, action) => {
      state.isLoading = false;
      state.result = action.payload as IUnsafeObject;
      state.user = null;
    });

    // signup action
    builder.addCase(authSignup.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(authSignup.fulfilled, (state, action) => {
      state.isLoading = false;
      if (action.payload?.statusCode === 200) {
        state.user = action.payload?.data;
        state.result = { ...action.payload, redirectTo: "/signin" };
      }
    });
    builder.addCase(authSignup.rejected, (state, action) => {
      state.isLoading = false;
      state.result = action.payload as IUnsafeObject;
      state.user = null;
    });

    // signup provider action
    builder.addCase(authProviderSignup.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(authProviderSignup.fulfilled, (state, action) => {
      state.isLoading = false;
      if (action.payload?.statusCode === 200) {
        state.user = action.payload?.data;
        state.result = { ...action.payload, redirectTo: "/" };
      }
    });
    builder.addCase(authProviderSignup.rejected, (state, action) => {
      state.isLoading = false;
      state.result = action.payload as IUnsafeObject;
      state.user = null;
    });

    // login-out action
    builder.addCase(authSignout.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(authSignout.fulfilled, (state, action) => {
      state.isLoading = false;
      state.result = { ...action.payload, redirectTo: "/signin" };
      state.user = null;
    });
    builder.addCase(authSignout.rejected, (state, action) => {
      state.isLoading = false;
      state.result = action.payload as IUnsafeObject;
      // if (state.result.statusCode === 401) {
      //   state.user = null;
      // }
    });

    // send forgot password email action
    builder.addCase(authSendForgotPasswordEmail.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(authSendForgotPasswordEmail.fulfilled, (state, action) => {
      state.isLoading = false;
      state.result = { ...action.payload, redirectTo: "" };
    });
    builder.addCase(authSendForgotPasswordEmail.rejected, (state, action) => {
      state.isLoading = false;
      state.result = action.payload as IUnsafeObject;
    });
  },
});

const authState = (state: TAppState) => state.authSlice;
export const authLoadingSelector = createSelector(
  (state: TAppState) => state.authSlice,
  (auth) => auth.isLoading
);
export const userSelector = createSelector(authState, (auth) => auth.user);
export const authResultSelector = createSelector(
  authState,
  (auth) => auth.result
);

export const authUserSelector = createSelector(authState, (auth) => {
  const currentUser = (auth.user ||
    FirebaseClient.auth.currentUser) as any;

  FirebaseClient.auth.onAuthStateChanged(async (authUser) => {
    if (authUser?.uid) {
      const result = prepareAuthResponse(authUser);
      setAuthTokenToCookie(result?.accessToken);
    } else {
      removeAuthTokenFromCookie();
      return useRouter().push("/signin");
    }
  });

  return prepareAuthResponse(currentUser);
});

export function useFirebaseAuthUser() {
  const [authState, setAuthState] = useState<IUnsafeObject<any>>({
    data: null,
    isLoggedIn: false,
    loading: true,
  });
  const router = useRouter();
  const dispatch = useAppDispatch();

  const authRedirect = useCallback(
    (authToken: string | undefined) => {
      setAuthState((state: IUnsafeObject) => ({
        ...state,
        isLoggedIn: authToken ? true : false,
      }));
      if (authToken) {
        FirebaseClient.auth.onAuthStateChanged(async (authUser) => {
          if (authUser?.uid) {
            const result = prepareAuthResponse(authUser);
            setAuthTokenToCookie(result?.accessToken);
            setAuthState({ data: result, isLoggedIn: true, loading: false });
            dispatch(AuthSlice.actions.updateUser(result));
          } else {
            removeAuthTokenFromCookie();
            setAuthState({ data: null, isLoggedIn: false, loading: false });
            dispatch(AuthSlice.actions.updateUser(null));
            return router.push("/signin");
          }
        });
      }
    },
    [router]
  );

  useEffect(() => {
    const authToken = getAuthTokenFromCookie();
    authRedirect(authToken);
  }, []);

  return authState;
}

export const accessTokenSelector = createSelector(
  userSelector,
  (user) => !!user?.accessToken
);

// export const accessTokeExpiredSelector = createSelector(
//   userSelector,
//   (user) => {
//     let isExpired = true;
//     if (user?.accessTokenExpiresIn) {
//       let expireIn = user?.accessTokenExpiresIn as string;
//       expireIn += "Z";
//       isExpired = new Date(expireIn) < new Date();
//     }
//     return isExpired;
//   }
// );

export const authAction = AuthSlice.actions;
export const AuthReducer = AuthSlice.reducer;
