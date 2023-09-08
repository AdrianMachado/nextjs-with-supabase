import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the Auth Helpers package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-sign-in-with-code-exchange
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    const sessionData = await supabase.auth.exchangeCodeForSession(code);
    const { user } = sessionData?.data;
    if (!user) {
      return NextResponse.redirect(
        `${requestUrl.origin}/login?error=Could not authenticate user`,
        {
          status: 301,
        },
      );
    }
    await fetch(
      "https://dev-portal-git-sessionauth.zuplosite.com/docs/zp/auth/external-sso?dev-portal-host=chocolate-leech-main-b8c57ea.d2.zuplo.dev",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "dev-portal-secret": "testing12345",
        },
        body: JSON.stringify({
          email: user.email,
          name: user.user_metadata?.full_name,
          email_verified: user.confirmed_at != null,
          sub: user.id,
        }),
      },
    );
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin);
}
