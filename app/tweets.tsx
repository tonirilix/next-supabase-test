"use client";
import { useEffect, experimental_useOptimistic as useOptimistic } from "react";
import { Likes } from "./likes";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

type TweetsProps = {
  tweets: Array<any>;
};
export function Tweets({ tweets }: TweetsProps) {
  const router = useRouter();
  const [optimisticTweets, addOptimisticTweet] = useOptimistic<
    TweetsProps["tweets"],
    any
  >(tweets, (current, newTweet) => {
    const newOptimisticTweets = [...current];
    const index = newOptimisticTweets.findIndex(
      (tweet) => tweet.id === newTweet.id
    );
    newOptimisticTweets[index] = newTweet;

    return newOptimisticTweets;
  });

  const supabase = createClientComponentClient<SupabaseDB>();
  useEffect(() => {
    const channel = supabase
      .channel("realtime tweets")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tweets",
        },
        (payload) => {
          console.log("payload", payload);
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router, supabase]);

  return optimisticTweets?.map((tweet) => (
    <div key={tweet.id}>
      <p>{tweet?.profiles?.username}</p>
      <p>{tweet.title}</p>
      <Likes tweet={tweet} addOptimisticTweet={addOptimisticTweet} />
    </div>
  ));
}
