"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const GithubLogin = ({
  sessionCreateUrl,
}: {
  sessionCreateUrl: string | string[] | undefined;
}) => {
  return (
    <button
      type="button"
      onClick={async () => {
        const supabase = createClientComponentClient();
        await supabase.auth.signInWithOAuth({
          provider: "github",
          options: {
            redirectTo:
              typeof sessionCreateUrl === "string"
                ? `${window.location.origin}/auth/callback`
                : undefined,
            queryParams:
              // This will allow your /auth/callback route to receive the
              // session-create-url query param and redirect the user to the
              // dev portal after signing in.
              typeof sessionCreateUrl === "string"
                ? {
                    sessionCreateUrl: encodeURIComponent(sessionCreateUrl),
                  }
                : undefined,
          },
        });
      }}
      className="border border-purple-700 rounded px-4 py-2 text-black dark:text-white mb-2"
    >
      Github
    </button>
  );
};

export default GithubLogin;
