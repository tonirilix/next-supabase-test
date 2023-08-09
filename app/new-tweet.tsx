import { User, createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Image from "next/image";

export const dynamic = "force-dynamic";

type NewTweetProps = {
  user: User;
};
export function NewTweet({ user }: NewTweetProps) {
  const addTweet = async (formData: FormData) => {
    "use server";
    const title = String(formData.get("title"));
    console.log("new tweet", title);

    const supabase = createServerActionClient<SupabaseDB>({
      cookies,
    });

    await supabase.from("tweets").insert({ title, user_id: user.id });
  };

  return (
    <form className="border border-gray-800 border-t-0" action={addTweet}>
      <div className="flex py-8 px-4">
        <div className="h-12 w-12">
          <Image
            src="https://avatars.githubusercontent.com/u/3756508?v=4"
            alt="user avatar"
            width={48}
            height={48}
            className="rounded-full"
          />
        </div>
        <input
          name="title"
          placeholder="What's happening?"
          className="bg-inherit flex-1 ml-2 text-2xl leading-loose placeholder-gray-500 px-2"
        />
      </div>
    </form>
  );
}
