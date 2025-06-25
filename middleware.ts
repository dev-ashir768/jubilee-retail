import { NextRequest, NextResponse } from "next/server";

type PublicRoutes = string | RegExp;

// Public Routes (no authorization needed)
const publicRoutes: PublicRoutes[] = [
  /^\/login$/,
  /^\/profile$/,
  "/favicon.ico",
  "/not-found",
  /^\/_next\//,
  /^\/static\//,
  /^\/images\//,
];

export function middleware(req: NextRequest) {
  console.log("Middleware triggered");

  const pathname = req.nextUrl.pathname;
  const token = req.cookies.get("jubilee-token")?.value;

  const isLoginPage = pathname.endsWith("/login");
  const isPublicRoute = publicRoutes.some((route) =>
    typeof route === "string"
      ? route === pathname
      : route instanceof RegExp
      ? route.test(pathname)
      : false
  );

  if (!token) {
    console.log("No token found", { pathname });
    if (isPublicRoute || isLoginPage) {
      console.log("Public route, authentication not required");
      return NextResponse.next();
    }
    console.log("No token found, redirecting to login page", { pathname });
    return NextResponse.redirect(new URL("/login", req.url));
  } else {
    if (isLoginPage || pathname === "/otp") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
}

export const config = {
  matcher: ["/:path*"],
};
