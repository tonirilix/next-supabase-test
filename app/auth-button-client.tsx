"use client";

import {
  type Session,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { env } from "@/env.mjs";

type AuthButtonClientProps = {
  session: Session | null;
};
export function AuthButtonClient({ session }: AuthButtonClientProps) {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

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

  return session ? (
    <button onClick={handleSignOut}>Logout</button>
  ) : (
    <>
      <button onClick={handleSignIn}>Login with Github</button> <br />
      <button onClick={handleSignInEmail}>Login email</button>
    </>
  );
}
