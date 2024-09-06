import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
export { default } from "next-auth/middleware"
import { getToken } from "next-auth/jwt"

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {

    const token = await getToken({ req: request })
    const currentUrl = request.nextUrl

    //NOTE - check if token exists and has valid expiration then redirect to dashboard
    if (token && (
        currentUrl.pathname.startsWith('/sign-up') ||
        currentUrl.pathname.startsWith('/verify') ||
        currentUrl.pathname.startsWith('/sign-in') ||
        currentUrl.pathname.startsWith('/')
    )) {
        return NextResponse.redirect(new URL('/dashbord', request.url))
    }

    //NOTE - check if not token exists and user is not authenticated then redirect to sign-in
    if (!token && currentUrl.pathname.startsWith('/dashbord')) {
        return NextResponse.redirect(new URL('/sign-in', request.url))
    }

    return NextResponse.next()

}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        "/",
        "/sign-in",
        "/sign-up",
        "/dashbord/:path*",
        "/verify/:path*",
    ],
}