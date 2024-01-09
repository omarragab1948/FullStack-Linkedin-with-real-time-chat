import { NextResponse } from "next/server";

export function middleware(request) {
  const pathAvailable = request.nextUrl.pathname;
  const publicPaths = ["/", "/signin", "/signup"];

  const isAuthenticated = !!request.cookies.get("token");

  // If authenticated and trying to access any public paths, redirect to home
  if (isAuthenticated && publicPaths.includes(pathAvailable)) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // If not authenticated and trying to access private paths, redirect to login
  if (!isAuthenticated && !publicPaths.includes(pathAvailable)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Continue processing if no redirect is needed
  return NextResponse.next();
}

export const config = {
  // Define your matcher patterns accordingly
  matcher: [
    "/",
    "/signin",
    "/signup",
    "/home",
    "/jobs",
    "/messaging",
    "/network",
    "/notifications",
    "/home/profile",
    "/home/profile/education",
  ],
};
