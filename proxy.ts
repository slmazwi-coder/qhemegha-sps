import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasEnvVars } from "@/lib/utils";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  if (!hasEnvVars) {
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Disable public sign-up; staff accounts are created by admins
  if (pathname === "/auth/sign-up") {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  // Protect all staff routes
  if (pathname.startsWith("/staff")) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/login";
      return NextResponse.redirect(url);
    }

    // Extra admin-only guard for user management
    if (pathname.startsWith("/staff/users")) {
      const { data: row } = await supabase
        .from("staff_users")
        .select("role")
        .eq("id", user.id)
        .single();

      if (!row || row.role !== "admin") {
        const url = request.nextUrl.clone();
        url.pathname = "/staff";
        return NextResponse.redirect(url);
      }
    }
  }

  // If already logged in as staff, send them to the staff area from auth pages
  if (pathname.startsWith("/auth") && user) {
    const { data: row } = await supabase
      .from("staff_users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (row) {
      const url = request.nextUrl.clone();
      url.pathname = "/staff";
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
