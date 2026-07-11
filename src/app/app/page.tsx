import { redirect } from "next/navigation";
import KakeiboApp from "@/components/KakeiboApp";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "@/components/SignOutButton";
import AuthSettings from "@/components/AuthSettings";

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
      <div className="mx-auto mt-3 flex w-full max-w-lg px-4">
        <AuthSettings currentEmail={user.email ?? ""} />
      </div>
      <KakeiboApp />
    </div>
  );
}
