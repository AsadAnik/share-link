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
// Create new links, replacing old links for the user
export async function POST(request: NextRequest) {
    try {
        const authUser = await IsAuthenticated();
        const requestBody = await request.json();
        const linksInfo: ILink[] = requestBody;

        // Delete old links for the authenticated user
        await linkService.removeLinksByUserId(authUser?.uid);

        // Add new links for the user
        const createdLinks = [];
        
        for (const linkInfo of linksInfo) {
            const linkData: ILink = {
                id: uuidv7(),
                platform: linkInfo.platform,
                url: linkInfo.url,
                user_id: authUser?.uid,
                createdAt: new Date().toISOString(),
            };

            const createdLink = await linkService.createLink(linkData);
            createdLinks.push(createdLink);
        }

        return PrepareApiResponse.response({
            data: createdLinks,
            message: 'Links created and old links replaced',
        });
    } catch (error) {
        return PrepareApiResponse.errorsResponse(error);
    }
}
