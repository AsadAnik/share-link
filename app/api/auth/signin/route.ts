import { NextRequest } from 'next/server';
import { HttpStatus, IAuthUser, TSingIn } from '@/shared/types';
import { PrepareApiResponse } from '@/shared/utils';
import { CustomError, validateSigninRequest } from '@/shared/validations';
import * as authService from '@/app/api/auth/auth.service';


/**
 * Sign-in User
 * @param request 
 * @returns 
 */
// region POST /api/auth/signin
export async function POST(request: NextRequest) {
    try {
        const providerToken = request.headers.get('x-provider-token');
        let userProfile = {} as IAuthUser;

        if (providerToken) {
            userProfile = await signinWithProvider(providerToken);

        } else {
            const payload: TSingIn = await request.json();
            userProfile = await signinWithCredentials(payload);
        }

        return PrepareApiResponse.response({
            data: userProfile,
            message: 'User signed in successfully.',
        });
    } catch (error) {
        return PrepareApiResponse.errorsResponse(error);
    }
}

/**
 * Signin User
 * @param providerToken 
 * @returns 
 */
// region Sign-in Provider
async function signinWithProvider(providerToken: string) {
    try {
        const { userRecord, profileInfo } = await authService.authPreProcess(providerToken);

        if (profileInfo?.uid) {
            await authService.authPostProcess(profileInfo);
        }

        const customToken = await authService.generateToken(userRecord?.uid);
        return authService.prepareAuthResponse({ ...userRecord, customToken });

    } catch (error) {
        console.error('Signin error', error);
        throw error;
    }
}

/**
 * Sign in User with Credentials
 * @param payload 
 * @returns 
 */
// region Sign-in Credentials
async function signinWithCredentials(payload: TSingIn) {
    try {
        validateSigninRequest(payload);
        const userRecord = await authService.signinWithCredentials(payload);

        if (!userRecord?.user?.emailVerified) {
            throw new CustomError('Your email is not verified.', {
                message: 'Please verify you email address.',
                code: HttpStatus.FORBIDDEN,
                name: 'EmailVerify',
            });
        }

        const customToken = await authService.generateToken(userRecord?.user?.uid);

        return authService.prepareAuthResponse({
            ...userRecord?.user,
            customToken,
        });

    } catch (error) {
        console.error('Signin error', error);
        throw error;
    }
}
