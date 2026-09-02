import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, COOKIE_NAME } from "@/lib/panel-auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // La pantalla de login siempre queda accesible
  if (pathname === "/panel/login") {
    return NextResponse.next();
  }

  const token = req.cookies.get(COOKIE_NAME)?.value;
  const username = await verifySessionToken(token);

  if (!username) {
    const loginUrl = new URL("/panel/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/panel/:path*"],
};
