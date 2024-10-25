import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { HttpStatus } from '@/shared/types';
import { X_NEXT_TOKEN } from './shared/const';

export async function middleware(request: NextRequest) {
    const requestPath = request.nextUrl.pathname;
    const requestHeaders = new Headers(request.headers);
    if (requestPath.match(/^\/api\/(?!health$|auth\/signin$|auth\/signup$).*$/)) {
        const authHeader = request.headers.get('authorization');
        const authTokenFromHeader =
            authHeader?.split('bearer ')[1] || authHeader?.split('Bearer ')[1];
        if (!authTokenFromHeader) {
            return NextResponse.json(
                {
                    metadata: {
                        timestamp: new Date().toUTCString(),
                    },
                    message: 'Access Denied. Authorization token is required.',
                    data: null,
                    error: {
                        name: 'Forbidden',
                        message: 'You do not have permission to access this resource.',
                    },
                },
                {
                    status: HttpStatus.FORBIDDEN,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            );
        }
        requestHeaders.set('access-token', authTokenFromHeader);
        requestHeaders.set('authorization', `bearer ${authTokenFromHeader}`);
    } else {
        const authTokenFromCookie = request.cookies.get(X_NEXT_TOKEN)?.value;
        if (requestPath.match(/^\/(signin$|signup$|forgot-password$).*$/)) {
            if (authTokenFromCookie) {
                return NextResponse.redirect(new URL('/link', request.url));
            }
        // } else if (requestPath !== '/' && !authTokenFromCookie) {
        } else if (!authTokenFromCookie) {
            return NextResponse.redirect(new URL('/signin', request.url));
        }
    }

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
}

// See "Matching Paths" below to learn more// Apply middleware to protected routes
export const config = {
    matcher: [
        '/',
        '/link',
        '/profile',
        '/preview',
        '/api/user/me',
        '/((?!api-docs|about|contact|blogs|terms-conditions|verify-email.*|api/health.*|api/auth/signin|api/auth/signup|api/auth/verify-email.*|api/link.*|api/user.*|playlist/.*|profile.*/|api/subscription/webhook|_next/static|_next/image|favicon.ico).*)',
    ],
};