import Link from "next/link";
import Messages from "./messages";
import GithubLogin from "./GithubLogin";

export default function Login({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <Link
        href="/"
        className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>{" "}
        Back
      </Link>

      <form
        className="flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
        action={`/auth/sign-in${
          typeof searchParams?.["session-create-url"] === "string"
            ? `?session-create-url=${encodeURIComponent(
                searchParams["session-create-url"]
              )}`
            : ""
        }`}
        method="post"
      >
        <label className="text-md" htmlFor="email">
          Email
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          name="email"
          placeholder="you@example.com"
          required
          // defaultValue={"adrian+supabase@zuplo.com"}
        />
        <label className="text-md" htmlFor="password">
          Password
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          type="password"
          name="password"
          placeholder="••••••••"
          // defaultValue={"testing1234"}
          required
        />
        <button className="bg-green-700 rounded px-4 py-2 text-white mb-2">
          Sign In
        </button>

        <GithubLogin sessionCreateUrl={searchParams?.["session-create-url"]} />
        <button
          formAction={`/auth/sign-up${
            typeof searchParams?.["session-create-url"] === "string"
              ? `?session-create-url=${encodeURIComponent(
                  searchParams["session-create-url"]
                )}`
              : ""
          }`}
          className="border border-gray-700 rounded px-4 py-2 text-black dark:text-white mb-2"
        >
          Sign Up
        </button>
        <Messages />
      </form>
    </div>
  );
}
