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

        // validate links before processing
        for (const link of linksInfo) {
            const validation = validateLink(link);

            if (!validation.valid) {
                throw new Error(`Validation failed for platform '${link.platform}': ${validation.message}`);
            }
        }

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



// Supported platforms and their URL patterns
// region Validate Supports
const platformPatterns: Record<string, RegExp> = {
    facebook: /^https:\/\/(www\.)?facebook\.com\/[A-Za-z0-9.]+$/,
    twitter: /^https:\/\/(www\.)?twitter\.com\/[A-Za-z0-9_]+$/,
    linkedin: /^https:\/\/(www\.)?linkedin\.com\/in\/[A-Za-z0-9-]+$/,
    github: /^https:\/\/(www\.)?github\.com\/[A-Za-z0-9-]+$/,
    instagram: /^https:\/\/(www\.)?instagram\.com\/[A-Za-z0-9_.]+$/,
    youtube: /^https:\/\/(www\.)?youtube\.com\/[A-Za-z0-9-]+$/,
    // Add more platforms as needed
};

/**
 * VALIDATION OF THE LINKS AND URL WITH PLARFORMS
 * @param link 
 * @returns 
 */
// region Validate Link
function validateLink(link: ILink): { valid: boolean; message: string } {
    const platform = link?.platform?.toLowerCase();
    const url = link?.url?.toLowerCase();

    if (!platformPatterns[platform]) {
        return { valid: false, message: `Plartform ${platform} is not supported.` };
    }

    const urlPattern = platformPatterns[platform];
    if (!urlPattern.test(url)) {
        return { valid: false, message: `Invalid URL for platform ${platform}.` };
    }

    return { valid: true, message: '' };
}