import { IAuthUser, TSingUp, IUserProfile } from '@/shared/types';
import { PrepareApiResponse } from '@/shared/utils';
import { validateSignupRequest } from '@/shared/validations';
import { NextRequest } from 'next/server';
import * as authService from '@/app/api/auth/auth.service';


/**
 * Signup User
 * @param request 
 * @returns 
 */
// region POST /api/auth/signup
export async function POST(request: NextRequest) {
    try {
        const providerToken = request.headers.get('x-provider-token');
        let authUser = {} as IAuthUser;

        if (providerToken) {
            authUser = await signupWithProvider(providerToken);

        } else {
            const payload: TSingUp = await request.json();
            const validate = validateSignupRequest(payload);

            if (!validate.valid) {
                return PrepareApiResponse.response({ ...validate });
            }

            authUser = await signupWithCredentials(payload);
        }

        // FOR IMPLEMENTATION LATER ON (IF NEEDED)
        // let message = 'Your account has been successfully created';
        // message = !providerToken ? message + '. A verification email has been sent to you. Please verify your email address.' : message;

        return PrepareApiResponse.response({
            data: authUser,
            message: 'Your account has been successfully created',
        });

    } catch (error) {
        return PrepareApiResponse.errorsResponse(error);
    }
}

/**
 * Signup User with Credentials
 * @param payload 
 * @returns 
 */
//  region Signup Credentials
async function signupWithCredentials(payload: TSingUp) {
    try {
        const userRecord = await authService.createUser(payload);

        const profileInfo: IUserProfile = {
            uid: userRecord.uid,
            displayName: userRecord.displayName,
            email: userRecord.email,
            userName: userRecord.uid,
            photoUrl: userRecord.photoURL,
            isVerified: userRecord.emailVerified,
            createdAt: userRecord.metadata.creationTime,
        };

        await authService.authPostProcess(profileInfo);
        const customToken = await authService.generateToken(userRecord?.uid);
        return authService.prepareAuthResponse({ ...userRecord, customToken });

    } catch (error) {
        console.error('Signup error', error);
        throw error;
    }
}

/**
 * Signup User with Provider
 * @param providerToken 
 * @returns 
 */
//  region Signup Provider
async function signupWithProvider(providerToken: string) {
    try {
        const { profileInfo, userRecord } = await authService.authPreProcess(providerToken);

        if (profileInfo?.uid && profileInfo.email) {
            await authService.createUser({
                email: profileInfo.email,
            });
        }

        if (profileInfo?.uid) {
            await authService.authPostProcess(profileInfo);
        }

        const customToken = await authService.generateToken(userRecord?.uid);
        return authService.prepareAuthResponse({ ...userRecord, customToken });

    } catch (error) {
        console.error('Signup error', error);
        throw error;
    }
}
