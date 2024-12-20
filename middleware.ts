import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(function middleware(req) {
  const token = req.nextauth.token;
  if (!token) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  const { role } = token;
  if (req.url.includes("/admin") && role !== "admin") {
    return new NextResponse("Forbidden", { status: 403 });
  }
  if (
    req.url.includes("/hostel-staff") &&
    role !== "plantStaff" &&
    role !== "admin" &&
    role !== "hostelStaff"
  ) {
    return new NextResponse("Forbidden", { status: 403 });
  }
  if (
    req.url.includes("/plant-staff") &&
    role !== "plantStaff" &&
    role !== "admin"
  ) {
    return new NextResponse("Forbidden", { status: 403 });
  }
  if (req.url.includes("/student") && role !== "student" && role !== "admin") {
    return new NextResponse("Forbidden", { status: 403 });
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Protect all routes except these:
    "/((?!sign-in|sign-up|staff-sign-up|api).*)",
  ],
};
