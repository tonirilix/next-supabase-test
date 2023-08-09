"use client";
import { experimental_useOptimistic as useOptimistic } from "react";
import { Likes } from "./likes";

type TweetsProps = {
  tweets: Array<any>;
};
export function Tweets({ tweets }: TweetsProps) {
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
  return optimisticTweets?.map((tweet) => (
    <div key={tweet.id}>
      <p>{tweet?.profiles?.username}</p>
      <p>{tweet.title}</p>
      <Likes tweet={tweet} addOptimisticTweet={addOptimisticTweet} />
    </div>
  ));
}
