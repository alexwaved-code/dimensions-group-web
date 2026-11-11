import { NextResponse, type NextRequest } from "next/server";

const LOCALES = ["en", "zh"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (LOCALES.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))) return;

  const accept = request.headers.get("accept-language") ?? "";
  const locale = /^zh|,\s*zh/i.test(accept) ? "zh" : "en";
  request.nextUrl.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ["/((?!_next|api|brand/|.*\\..*).*)"],
};
