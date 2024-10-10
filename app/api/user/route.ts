import { PrepareApiResponse } from '@/shared/utils';
import { IUserProfile } from '@/shared/types';
import { type NextRequest } from 'next/server';
import * as usersService from './user.service';
import { IsAuthenticated } from '@/app/api/helpers';


/**
 * Get User Profile Details
 * @param _request 
 * @returns 
 */
// region GET /api/user
export async function GET(_request: NextRequest) {
    try {
        const authUser = await IsAuthenticated();
        const profileInfo = await usersService.getUserProfile(authUser?.uid);

        return PrepareApiResponse.response({
            data: profileInfo.data(),
            message: 'Get profile details',
        });

    } catch (error) {
        return PrepareApiResponse.errorsResponse(error);
    }
}

/**
 * Update User Profile Details
 * @param request 
 * @returns 
 */
// region POST /api/user
export async function PUT(request: NextRequest) {
    try {
        const authUser = await IsAuthenticated();
        const requestBody = await request.json();
        const profileInfo: IUserProfile = requestBody;
        const updatedProfile = await usersService.updateProfile(authUser?.uid, profileInfo);

        return PrepareApiResponse.response({
            data: updatedProfile,
            message: 'Update profile details',
        });

    } catch (error) {
        return PrepareApiResponse.errorsResponse(error);
    }
}

/**
 * Update User Profile Picture
 * @param request 
 * @returns 
 */
// region PATCH /api/user
export async function PATCH(request: NextRequest) {
    try {
        const authUser = await IsAuthenticated();
        if (!authUser) throw new Error('Unauthorized access.');

        const authUserID = authUser?.uid;
        const contentType = request.headers.get('content-type');

        if (!contentType?.includes('multipart/form-data')) {
            throw new Error('Invalid content-type. Expected multipart/form-data');
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file || !(file instanceof File)) {
            throw new Error('No file provided or invalid file.');
        }

        // Convert the file to Buffer
        const buffer = Buffer.from(await file.arrayBuffer());
        const requestBody: IUserProfile = { uid: authUserID, image: buffer };

        const updatedProfile = await usersService.uploadProfileImage(authUserID, requestBody);

        return PrepareApiResponse.response({
            data: updatedProfile,
            message: 'Profile Updated Successfully',
        });

    } catch (error) {
        return PrepareApiResponse.errorsResponse(error);
    }
}

/**
 * Delete User Account
 * @param _request 
 * @returns 
 */
// region DELETE /api/user
export async function DELETE(_request: NextRequest) {
    try {
        const authUser = await IsAuthenticated();
        await usersService.deleteUser(authUser?.uid);

        return PrepareApiResponse.response({
            data: {
                user_id: authUser?.uid,
            },
            message: 'Deleted user account',
        });

    } catch (error) {
        return PrepareApiResponse.errorsResponse(error);
    }
}