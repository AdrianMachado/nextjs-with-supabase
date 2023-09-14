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
  const sessionCreateUrl = requestUrl.searchParams.get("session-create-url");
  const redirectUrl = new URL(`${requestUrl.origin}/auth/callback`);
  if (sessionCreateUrl) {
    redirectUrl.searchParams.set("session-create-url", sessionCreateUrl);
  }
  console.log(
    "Sign up",
    email,
    password,
    sessionCreateUrl,
    redirectUrl.toString(),
  );
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectUrl.toString(),
    },
  });

  if (error) {
    console.log("Sign up error", error);
    return NextResponse.redirect(
      `${requestUrl.origin}/login?error=Could not authenticate user`,
      {
        // a 301 status is required to redirect from a POST to a GET route
        status: 301,
      },
    );
  }

  return NextResponse.redirect(
    `${requestUrl.origin}/login?message=Check email to continue sign in process`,
    {
      // a 301 status is required to redirect from a POST to a GET route
      status: 301,
    },
  );
}
