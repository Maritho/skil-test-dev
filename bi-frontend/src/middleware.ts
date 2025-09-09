import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const isAuthenticated = !!token;
    const isLoginPage = req.nextUrl.pathname.startsWith("/");
    
    if (!isAuthenticated && !isLoginPage) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", '/'],
};
