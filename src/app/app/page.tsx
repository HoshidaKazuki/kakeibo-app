import { redirect } from "next/navigation";
import KakeiboApp from "@/components/KakeiboApp";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "@/components/SignOutButton";

export default async function AppPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="relative flex min-h-full flex-1 flex-col bg-background font-sans">
      <div className="mx-auto mt-4 flex w-full max-w-lg justify-end px-4">
        <SignOutButton />
      </div>
      <KakeiboApp />
    </div>
  );
}
