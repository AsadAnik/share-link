import fbAdminAuth from 'firebase-admin/auth';
import { FirebaseAdmin, FirebaseServerClient } from '@/lib/firebase';
import { IUnsafeObject, TSingUp, IAuthUser, IUserProfile } from '@/shared/types';
import * as usersService from '@/app/api/user/user.service';


/**
 * Create User / Sign Up | Register User
 * @param payload 
 * @returns 
 */
// region Create User
export async function createUser(payload: TSingUp) {
    const firebase = FirebaseAdmin.init();
    try {
        const userRecord = await firebase.getAuth().createUser({
            email: payload?.email as string,
            emailVerified: true,
            displayName: payload?.name as string,
            password: payload?.password as string,
            photoURL: `${process.env.NEXT_PUBLIC_API_URL}/default-avatar.png`,
            disabled: false,
        });

        // IF NEEDED SEND EMAIL VERIFICATION TO USER (WILL DO IF NEEDED LATER ON)
        // await sendEmailVerification(payload);

        return userRecord;

    } catch (error) {
        const { message } = error as unknown as IUnsafeObject;
        console.error("Create user error:", message);
        throw error;
    }
}

/**
 * Update User | Update User Profile
 * @param uid 
 * @param payload 
 * @returns 
 */
// region Update User
export async function updateUser(
    uid: string,
    payload: fbAdminAuth.UpdateRequest,
) {
    try {
        const firebase = FirebaseAdmin.init();
        const userRecord = await firebase.getAuth().updateUser(uid, payload);
        return userRecord;

    } catch (error) {
        const { message } = error as unknown as IUnsafeObject;
        console.error('Update user error:', message);
        throw error;
    }
}

/**
 * Sign In User
 * @param credentials 
 * @returns 
 */
// region Sign-In User
export async function signinWithCredentials(credentials: any) {
    try {
        const result = await FirebaseServerClient.signInWithEmailAndPassword(
            FirebaseServerClient.auth,
            credentials.email,
            credentials.password,
        );
        return result;

    } catch (error) {
        const { message } = error as unknown as IUnsafeObject;
        console.error('Signin credentials error:', message);
        throw error;
    }
}

/**
 * Sign Out User
 * @param uid 
 * @returns 
 */
// region Sign-Out User
export async function userSignOut(uid: string) {
    try {
        const firebase = FirebaseAdmin.init();
        await firebase.getAuth().revokeRefreshTokens(uid);
        return true;

    } catch (error) {
        throw error;
    }
}

/**
 * Auth Pre-Process
 * @param providerToken 
 * @returns 
 */
// region Auth Pre-Process
export async function authPreProcess(providerToken: string) {
    try {
        const userRecord = await verifyAuthToken(providerToken);
        const hasProfile = await isProfileExist(userRecord.uid);
        let profileInfo = {} as IUserProfile;

        if (!hasProfile) {
            profileInfo = {
                uid: userRecord?.uid ?? userRecord?.sub,
                displayName: userRecord?.name,
                email: userRecord?.email,
                userName: userRecord?.uid,
                photoUrl: userRecord?.picture ?? '',
                isVerified: userRecord?.email_verified,
                createdAt: userRecord?.auth_time,
            };
        }

        return { profileInfo, userRecord };

    } catch (error) {
        const { message } = error as unknown as IUnsafeObject;
        console.error('Auth pre process error:', message);
        throw error;
    }
}

/**
 * Auth Post-Process
 * @param userProfile 
 * @returns 
 */
// region Auth Post-Process
export async function authPostProcess(userProfile: IUserProfile) {
    try {
        await usersService.updateProfile(userProfile?.uid, userProfile);
        return userProfile;

    } catch (error) {
        const { message } = error as unknown as IUnsafeObject;
        console.error('Auth post process error:', message);
        throw error;
    }
}

/**
 * Generate Token as Custom Token For Firebase
 * @param userUID 
 * @param additionalClaims 
 * @returns 
 */
// region Generate Token
export async function generateToken(
    userUID: string,
) {
    const firebase = FirebaseAdmin.init();
    try {
        const idToken = await firebase
            .getAuth()
            .createCustomToken(userUID);
        return idToken;

    } catch (error) {
        const { message } = error as unknown as IUnsafeObject;
        console.error('Token generate error:', message);
        throw error;
    }
}

/**
 * Verify Auth Token
 * @param authToken 
 * @returns 
 */
// region Verify Token
export async function verifyAuthToken(authToken: string) {
    const firebase = FirebaseAdmin.init();
    try {
        const result = await firebase.getAuth().verifyIdToken(authToken);
        return result;
    } catch (error) {
        const { message } = error as unknown as IUnsafeObject;
        console.error('Token verify error:', message);
        throw error;
    }
}

/**
 * Is User Exist
 * @param uid 
 * @returns 
 */
// region Is User Exist
export async function isProfileExist(uid: string) {
    const firebase = FirebaseAdmin.init();
    try {
        const firestore = firebase.getFireStore();
        const user = await firestore.collection('profiles').doc(uid).get();
        return user?.exists ? true : false;
    } catch (error) {
        throw error;
    }
}

/**
 * Prepare Auth Response
 * @param userRecord 
 * @returns 
 */
// region Pre-Auth Response
export function prepareAuthResponse(userRecord: IUnsafeObject<any>): IAuthUser {
    return {
        uid: userRecord?.uid,
        displayName: userRecord?.name ?? userRecord?.displayName,
        email: userRecord?.email,
        photoUrl: userRecord?.picture ?? userRecord?.photoURL,
        emailVerified: userRecord?.email_verified ?? userRecord?.emailVerified,
        tokenExpireAt: userRecord?.exp,
        accessToken: userRecord?.accessToken,
        customToken: userRecord?.customToken,
    };
}


// WILL IMPLEMENT LATER ON IF NEEDED..
// export async function sendEmailVerification(payload: any) {
//   try {
//     if (payload?.email && payload?.password) {
//       console.log(payload);
//       const userCredential = await signinWithCredentials(payload);
//       if (!userCredential) {
//         return;
//       }

//       if (userCredential?.user?.emailVerified) {
//         return userCredential?.user;
//       }

//       const redirectUrl = `${
//         process.env.NEXT_PUBLIC_API_URL
//       }/verify-email?state=${encryptData(userCredential?.user?.uid)}`;
//       await FirebaseServerClient.sendEmailVerification(userCredential?.user, {
//         url: redirectUrl,
//       });
//       return userCredential?.user;
//     }
//     return null;
//   } catch (error) {
//     const { message } = error as unknown as IUnsafeObject;
//     console.log("Send email verification error: ", message);
//   }
// }
