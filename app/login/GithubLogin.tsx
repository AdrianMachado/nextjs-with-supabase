"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const GithubLogin = ({
  tokenRedirectUrl,
}: {
  tokenRedirectUrl: string | undefined;
}) => {
  return (
    <button
      type="button"
      onClick={async () => {
        const supabase = createClientComponentClient();
        await supabase.auth.signInWithOAuth({
          provider: "github",
          options: {
            redirectTo: tokenRedirectUrl
              ? `${
                  window.location.origin
                }?tokenRedirectUrl=${encodeURIComponent(tokenRedirectUrl)}`
              : undefined,
            queryParams: tokenRedirectUrl
              ? {
                  tokenRedirectUrl: encodeURIComponent(tokenRedirectUrl),
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
