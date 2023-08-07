import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import AuthButtonServer from "./auth-button-server";
import { redirect } from "next/navigation";
import { NewTweet } from "./new-tweet";

export default async function Home() {
  const supabase = createServerComponentClient<SupabaseDB>({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const { data: tweets, error } = await supabase
    .from("tweets")
    .select("*, profiles(*)");

  return (
    <>
      <AuthButtonServer />
      <NewTweet />
      {tweets?.map((tweet, index) => (
        <div key={tweet.id}>
          <p>{tweet.profiles?.username}</p>
          <p>{tweet.title}</p>
        </div>
      ))}
    </>
  );
}
