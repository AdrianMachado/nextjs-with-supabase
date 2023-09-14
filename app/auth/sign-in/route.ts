import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const formData = await request.formData();
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  const supabase = createRouteHandlerClient({ cookies });

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    console.log("Sign in error", error);
    return NextResponse.redirect(
      `${requestUrl.origin}/login?error=Could not authenticate user`,
      {
        // a 301 status is required to redirect from a POST to a GET route
        status: 301,
      },
    );
  }

  const sessionCreateUrl = requestUrl.searchParams.get("session-create-url");
  if (sessionCreateUrl) {
    const user = data.user;
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
      console.log("SSO error", await ssoResponse.text());
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
        status: 301,
      },
    );
  }

  return NextResponse.redirect(requestUrl.origin, {
    status: 301,
  });
}
