import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function proxy(request: NextRequest) {
  const token = await getToken({ req: request })
  const url = request.nextUrl

  // If user is already logged in,
  // don't allow them to visit auth-related pages.
  if (
    token &&
    (
      url.pathname.startsWith("/sign-in") ||
      url.pathname.startsWith("/sign-up") ||
      url.pathname.startsWith("/verify")
    )
  ) {
    return NextResponse.redirect(
      new URL("/dashboard", request.url)
    )
  }

  // If user is not logged in,
  // don't allow them to access dashboard.
  if (
    !token &&
    url.pathname.startsWith("/dashboard")
  ) {
    return NextResponse.redirect(
      new URL("/sign-in", request.url)
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/sign-in",
    "/sign-up",
    "/",
    "/dashboard/:path*",
    "/verify/:path*",
  ],
}