"use client";
import { useEffect, experimental_useOptimistic as useOptimistic } from "react";
import { Likes } from "./likes";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
    <div key={tweet.id} className="border border-gray-800 px-4 py-8 flex">
      <div className="h-12 w-12">
        <Image
          src="https://avatars.githubusercontent.com/u/3756508?v=4"
          alt="user avatar"
          width={48}
          height={48}
          className="rounded-full"
        />
      </div>
      <div className="ml-4">
        <p>
          <span className="font-bold">
            {tweet?.profiles?.username.split("@")[0]}
          </span>
          <span className="text-sm ml-2 text-gray-400">
            {tweet?.profiles?.username}
          </span>
        </p>
        <p>{tweet.title}</p>
        <Likes tweet={tweet} addOptimisticTweet={addOptimisticTweet} />
      </div>
    </div>
  ));
}
