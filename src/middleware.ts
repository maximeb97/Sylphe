import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const response = NextResponse.next();

    // Easter eggs for curious developers looking at the Network tab
    response.headers.set('X-Sylphe-Corp', 'We see everything. Ce fichier de logs va dans les archives secrètes.');
    response.headers.set('X-MissingNo-Code', 'Il parait que le Terminal possède des commandes bizarres... Essayez de voir ce qui se passe si vous tapez "missingno".');
    response.headers.set('X-Hidden-Item', 'Il y a une Masterball non affectée dans /api/masterball ? (Peut-être pas)');

    return response;
}

// Config to specify which paths the middleware runs on
export const config = {
    matcher: '/:path*',
};
