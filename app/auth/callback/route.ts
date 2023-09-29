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
  const sessionCreateUrl = requestUrl.searchParams.get("session-create-url");
  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    const sessionData = await supabase.auth.exchangeCodeForSession(code);
    const { user } = sessionData?.data;
    if (!user) {
      console.error(
        "NO USER",
      );
      return NextResponse.redirect(
        `${requestUrl.origin}/login?error=Could not authenticate user`,
        {
          status: 301,
        },
      );
    }

    if (sessionCreateUrl) {
      const ssoResponse = await fetch(
        sessionCreateUrl,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "authorization": `Bearer ${process.env.ZUPLO_API_KEY}`,
          },
          body: JSON.stringify({
            email: user.email,
            name: user.user_metadata?.full_name,
            email_verified: user.confirmed_at != null,
            sub: user.id,
            picture: user.user_metadata?.avatar_url,
          }),
        },
      );

      if (!ssoResponse.ok) {
        console.error(
          "SSO NOT OK",
          await ssoResponse.text(),
        );
        return NextResponse.redirect(
          `${requestUrl.origin}/login?error=Could not authenticate user`,
          {
            status: 301,
          },
        );
      }

      const { redirectUri } = await ssoResponse.json();
      return NextResponse.redirect(
        redirectUri,
        {
          // a 301 status is required to redirect from a POST to a GET route
          status: 301,
        },
      );
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin);
}
