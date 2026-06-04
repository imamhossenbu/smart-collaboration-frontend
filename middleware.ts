import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // লোকাল স্টোরেজের টোকেন কুকি হিসেবে পাস করা বেস্ট প্র্যাকটিস,
  // তবে মিডলওয়্যার সরাসরি সার্ভারে চলায় এখানে আমরা কুকি চেক করব।
  const token = request.cookies.get("token")?.value;

  // ১. ইউজার যদি মেইন রুট (/) এ আসে, তাকে সরাসরি /login পেজে রিডাইরেক্ট করুন
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ২. ইউজার যদি ড্যাশবোর্ডে ঢুকতে চায় কিন্তু টোকেন না থাকে, তাকে লগইনে পাঠান
  if (pathname.startsWith("/dashboard") && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ৩. ইউজার যদি অলরেডি লগইন থাকে এবং লগইন/সাইনআপ পেজে যেতে চায়, তাকে ড্যাশবোর্ডে পাঠান
  if (
    (pathname.startsWith("/login") || pathname.startsWith("/signup")) &&
    token
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/login", "/signup"],
};
