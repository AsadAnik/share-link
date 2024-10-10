import { PrepareApiResponse } from '@/shared/utils';
import { ILink } from '@/shared/types';
import { type NextRequest } from 'next/server';
import * as linkService from '../link.service';
import { IsAuthenticated } from '@/app/api/helpers';


// region PUT /api/link
// Update link
export async function PUT(request: NextRequest, { params }: { params: { link_id: string } }) {
    try {
        await IsAuthenticated();

        const linkId = params?.link_id;
        const requestBody = await request.json();
        const linkInfo: ILink = requestBody;
        const updatedLink = await linkService.updateLink(linkId, linkInfo);

        return PrepareApiResponse.response({
            data: updatedLink,
            message: 'Update link',
        });

    } catch (error) {
        return PrepareApiResponse.errorsResponse(error);
    }
}

// region DELETE /api/link
// Delete link
export async function DELETE(_request: NextRequest, { params }: { params: { link_id: string } }) {
    try {
        await IsAuthenticated();
        
        const linkId = params?.link_id;
        await linkService.removeLink(linkId);

        return PrepareApiResponse.response({
            data: {
                link_id: linkId,
            },
            message: 'Deleted link',
        });

    } catch (error) {
        return PrepareApiResponse.errorsResponse(error);
    }
}