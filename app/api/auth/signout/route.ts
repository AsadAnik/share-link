export const dynamic = 'force-dynamic';
import * as authService from '@/app/api/auth/auth.service';
import { PrepareApiResponse } from '@/shared/utils';
import { IsAuthenticated } from '@/app/api/helpers';

/**
 * Signout User
 * @returns 
 */
// region GET /api/auth/signout
export async function GET() {
    try {
        const authUser = await IsAuthenticated();

        if (authUser?.uid) {
            await authService.userSignOut(authUser?.uid);
        }

        return PrepareApiResponse.response({
            data: null,
            message: 'User signed out successfully',
        });

    } catch (error) {
        return PrepareApiResponse.errorsResponse(error);
    }
}
