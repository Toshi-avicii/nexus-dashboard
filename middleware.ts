import { NextRequest, NextResponse } from "next/server";

const publicRoutes = [
    "/",
    "/user/sign-in"
]

export function middleware(req: NextRequest) {
    const accessToken = req.cookies.get("accessToken");
    const isAuthRoute = publicRoutes.includes(req.nextUrl.pathname);

    // if the user is visiting a protected route without access token
    if(!isAuthRoute && !accessToken) {
        return NextResponse.redirect(new URL('/user/sign-in', req.url));
    }

    // if the user is trying to vising an auth route with the access token
    if(accessToken && isAuthRoute) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next(); // allow access
}

export const config = {
    matcher: ['/', '/user/sign-in', '/dashboard/:path*']
}
