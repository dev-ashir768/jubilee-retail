// import { NextRequest, NextResponse } from "next/server";
// import { getCookie } from "cookies-next/server";
// import { cookies } from "next/headers";

// type PublicRoutes = string | RegExp;

// // Public Routes (no authorization needed)
// const publicRoutes: PublicRoutes[] = [
//   /^\/login$/,
//   /^\/profile$/,
//   "/favicon.ico",
//   "/not-found",
//   /^\/_next\//,
//   /^\/static\//,
//   /^\/images\//,
// ];

// export async function middleware(req: NextRequest, res: NextResponse) {
//   console.log("Middleware triggered");

//   const pathname = req.nextUrl.pathname;
//   const token = req.cookies.get("jubilee-retail-token")?.value;

//   const isLoginPage = pathname.endsWith("/login");
//   const isOtpPage = pathname.endsWith("/otp");

//   const userInfo = JSON.parse(
//     (await getCookie("userInfo", { cookies })) || "{}"
//   );
//   const isAuthenticated = !!userInfo?.username;

//   const isPublicRoute = publicRoutes.some((route) =>
//     typeof route === "string"
//       ? route === pathname
//       : route instanceof RegExp
//       ? route.test(pathname)
//       : false
//   );

//   // Case 1: User has a token (fully authenticated)

//   if (token) {
//     console.log("Token found, user is fully authenticated");
//     if (isLoginPage || isOtpPage) {
//       return NextResponse.redirect(new URL("/", req.url));
//     }
//     return NextResponse.next();
//   }

//   // Case 2: User has no token
//   if (!token) {
//     console.log("Token not found");
//     if (isLoginPage || isPublicRoute) {
//       console.log("Public route, authentication not required");
//       return NextResponse.next();
//     }
//     if (isOtpPage && isAuthenticated) {
//       console.log("Accessing /otp with valid userInfo, allowed");
//       return NextResponse.next();
//     }
//     console.log(
//       "No valid userInfo or unauthorized route, redirecting to /login"
//     );
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/:path*"],
// };

import { NextRequest, NextResponse } from "next/server";
import { getCookie } from "cookies-next/server";
import { cookies } from "next/headers";
import { get } from "http";

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

export async function middleware(req: NextRequest) {
  console.log("Middleware triggered");

  const pathname = req.nextUrl.pathname;
  const token = req.cookies.get("jubilee-retail-token")?.value;

  const isLoginPage = pathname.endsWith("/login");
  const isOtpPage = pathname.endsWith("/otp");

  const otpSession = await getCookie("otp-session", { cookies });
  const isPublicRoute = publicRoutes.some((route) =>
    typeof route === "string"
      ? route === pathname
      : route instanceof RegExp
      ? route.test(pathname)
      : false
  );

  // Case 1: User has a token (fully authenticated)
  if (token) {
    console.log("Token found, user is fully authenticated");
    if (isLoginPage || isOtpPage) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  // Case 2: User has no token
  if (!token) {
    console.log("Token not found");
    if (isLoginPage || isPublicRoute) {
      console.log("Public route, authentication not required");
      return NextResponse.next();
    }
    if (isOtpPage && otpSession) {
      console.log("Accessing /otp with valid userInfo, allowed");
      return NextResponse.next();
    }
    console.log(
      "No valid userInfo or unauthorized route, redirecting to /login"
    );
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
