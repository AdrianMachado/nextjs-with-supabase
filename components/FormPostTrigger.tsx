"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function FormPostTrigger() {
  const searchParams = useSearchParams();
  const tokenRedirectUrl = searchParams.get("tokenRedirectUrl");
  const [accessToken, setAccessToken] = useState<string>();
  const [refreshToken, setRefreshToken] = useState<string>();
  const getAccessToken = async () => {
    const supabase = createClientComponentClient();
    const session = await supabase.auth.getSession();
    const accessToken = session.data?.session?.access_token;
    const refreshToken = session.data?.session?.refresh_token;
    if (accessToken && refreshToken) {
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
    }
  };
  useEffect(() => {
    void getAccessToken();
  }, []);

  if (!tokenRedirectUrl || !accessToken || !refreshToken) {
    return null;
  }

  // Create a invisible form to post to the developer portal
  // Fetch will not work across domains, which is needed for the working-copy
  // developer portal
  const formElement = document.createElement("form");
  formElement.setAttribute("method", "post");
  formElement.style.display = "none";
  formElement.setAttribute("action", decodeURIComponent(tokenRedirectUrl));

  // First, add the access token as an input
  const accessTokenInputElement = document.createElement("input");
  accessTokenInputElement.setAttribute("type", "text");
  accessTokenInputElement.setAttribute("name", "accessToken");
  accessTokenInputElement.setAttribute("value", accessToken);

  // Next, add the access token as an input
  const refreshTokenInputElement = document.createElement("input");
  refreshTokenInputElement.setAttribute("type", "text");
  refreshTokenInputElement.setAttribute("name", "refreshToken");
  refreshTokenInputElement.setAttribute("value", refreshToken);

  // Finally, create a submit button
  const submitElement = document.createElement("input");
  submitElement.setAttribute("type", "submit");
  submitElement.setAttribute("value", "Submit");

  // Add the elements to the form
  formElement.appendChild(accessTokenInputElement);
  formElement.appendChild(refreshTokenInputElement);
  formElement.appendChild(submitElement);

  // Add the form to the document
  document.body.appendChild(formElement);
  document.getElementsByTagName("body")[0].appendChild(formElement);
  // Submit the form
  formElement.submit();

  return null;
}
