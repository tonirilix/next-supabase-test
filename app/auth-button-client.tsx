"use client";

import {
  type Session,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { env } from "@/env.mjs";
import { LoginButton } from "./login-button";

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

  return session ? (
    <button className="text-xs text-gray-400" onClick={handleSignOut}>
      Logout
    </button>
  ) : (
    <div className="flex flex-1 justify-center items-center gap-2">
      <LoginButton />
    </div>
  );
}
