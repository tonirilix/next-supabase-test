import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AuthButtonClient } from "../auth-button-client";

export const dynamic = "force-dynamic";

export default async function Login() {
  const supabase = createServerComponentClient<SupabaseDB>({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/");
  }

  return <AuthButtonClient session={session} />;
}
