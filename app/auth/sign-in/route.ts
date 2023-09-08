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
    return NextResponse.redirect(
      `${requestUrl.origin}/login?error=Could not authenticate user`,
      {
        // a 301 status is required to redirect from a POST to a GET route
        status: 301,
      },
    );
  }

  const { user } = data;
  if (!user) {
    return NextResponse.redirect(
      `${requestUrl.origin}/login?error=Could not authenticate user`,
      {
        status: 301,
      },
    );
  }

  const ssoResponse = await fetch(
    "https://dev-portal-git-sessionauth.zuplosite.com/docs/zp/auth/external-sso?dev-portal-host=chocolate-leech-main-b8c57ea.d2.zuplo.dev&dev-portal-id=chocolate-leech-main-b8c57ea",
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

  if (!ssoResponse.ok) {
    console.log(
      "SSO response not ok",
      ssoResponse.status,
      ssoResponse.statusText,
    );
    return NextResponse.redirect(
      `${requestUrl.origin}/login?error=Could not authenticate user`,
      {
        status: 301,
      },
    );
  }

  const { sessionId } = await ssoResponse.json();
  console.log(
    "session id",
    sessionId,
    `https://dev-portal-git-sessionauth.zuplosite.com/docs/zp/auth/external-redirect?sessionId=${sessionId}`,
  );
  // Redirect back home after sign-in, with the tokenRedirectUrl
  return NextResponse.redirect(
    `https://dev-portal-git-sessionauth.zuplosite.com/docs/zp/auth/external-redirect?sessionId=${sessionId}`,
    {
      // a 301 status is required to redirect from a POST to a GET route
      status: 301,
    },
  );
}
