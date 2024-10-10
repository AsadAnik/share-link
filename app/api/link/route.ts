import { PrepareApiResponse } from '@/shared/utils';
import { ILink } from '@/shared/types';
import { type NextRequest } from 'next/server';
import * as linkService from './link.service';
import { v7 as uuidv7 } from 'uuid';
import { IsAuthenticated } from '@/app/api/helpers';


// region GET /api/link
// Getting all links
export async function GET(_request: NextRequest) {
    try {
        const authUser = await IsAuthenticated();
        const links = await linkService.getAllLinks(authUser?.uid);

        return PrepareApiResponse.response({
            data: links,
            message: 'Get all links',
        });
    } catch (error) {
        return PrepareApiResponse.errorsResponse(error);
    }
}

// region POST /api/link
// Create new link
export async function POST(request: NextRequest) {
    try {
        const authUser = await IsAuthenticated();
        const requestBody = await request.json();
        const linkInfo: ILink = requestBody;

        const linkData: ILink = {
            id: uuidv7(),
            platform: linkInfo.platform,
            link: linkInfo.link,
            user_id: authUser?.uid,
            createdAt: new Date().toISOString(),
        };

        const createdLink = await linkService.createLink(linkData);

        return PrepareApiResponse.response({
            data: createdLink,
            message: 'Link created',
        });
    } catch (error) {
        return PrepareApiResponse.errorsResponse(error);
    }
}