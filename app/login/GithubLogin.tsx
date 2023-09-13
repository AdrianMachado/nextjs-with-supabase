"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const GithubLogin = ({
  sessionCreateUrl,
}: {
  sessionCreateUrl: string | undefined;
}) => {
  return (
    <button
      type="button"
      onClick={async () => {
        const supabase = createClientComponentClient();
        await supabase.auth.signInWithOAuth({
          provider: "github",
          options: {
            redirectTo: sessionCreateUrl
              ? `${
                  window.location.origin
                }/auth/callback?session-create-url=${encodeURIComponent(
                  sessionCreateUrl
                )}`
              : undefined,
            queryParams: sessionCreateUrl
              ? {
                  sessionCreateUrl: encodeURIComponent(sessionCreateUrl),
                }
              : undefined,
          },
        });
      }}
      className="border border-purple-700 rounded px-4 py-2 text-black dark:text-white mb-2"
    >
      Github (WIP)
    </button>
  );
};

export default GithubLogin;
