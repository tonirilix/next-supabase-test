import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export function NewTweet() {
  const addTweet = async (formData: FormData) => {
    "use server";
    const title = String(formData.get("title"));
    console.log("new tweet", title);

    const supabase = createServerActionClient<SupabaseDB>({
      cookies,
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await supabase.from("tweets").insert({ title, user_id: user.id });
    }
  };

  return (
    <form action={addTweet}>
      <input name="title" className="bg-inherit" />
    </form>
  );
}
