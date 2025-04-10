import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Check role-based access
    if (path.startsWith("/admin") && token?.role !== "admin" && token?.role !== "school_admin") {
      return NextResponse.redirect(new URL("/dashboard?error=Access denied: Admin access required", req.url))
    }

    if (
      path.startsWith("/department") &&
      token?.role !== "department_head" &&
      token?.role !== "admin" &&
      token?.role !== "school_admin"
    ) {
      return NextResponse.redirect(new URL("/dashboard?error=Access denied: Department head access required", req.url))
    }

    if (path.startsWith("/school") && token?.role !== "school_admin" && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard?error=Access denied: School admin access required", req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
)

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/classes/:path*",
    "/students/:path*",
    "/assignments/:path*",
    "/grades/:path*",
    "/materials/:path*",
    "/lesson-plans/:path*",
    "/calendar/:path*",
    "/admin/:path*",
    "/department/:path*",
    "/school/:path*",
  ],
}
