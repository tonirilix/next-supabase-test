"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { env } from "@/env.mjs";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function LoginButton() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: "http://localhost:3000/auth/callback",
      },
    });
  };

  const handleSignInEmail = async () => {
    await supabase.auth.signInWithPassword({
      email: env.NEXT_PUBLIC_TEST_USER,
      password: env.NEXT_PUBLIC_TEST_PASSWORD,
    });
    router.refresh();
  };
  return (
    <>
      <button
        className="hover:bg-gray-800 p-8 rounded-xl"
        onClick={handleSignIn}
        aria-label="Login with github"
      >
        <Image
          src="/github-mark-white.png"
          alt="github logo"
          width={100}
          height={100}
        />
      </button>
      <button
        className="text-xs text-gray-400 w-24 h-24 hover:bg-gray-800 p-8 rounded-xl"
        onClick={handleSignInEmail}
      >
        Login email
      </button>
    </>
  );
}
