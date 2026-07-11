import KakeiboApp from "@/components/KakeiboApp";
import SignOutButton from "@/components/SignOutButton";

export default function AppPage() {
  return (
    <div className="relative flex min-h-full flex-1 flex-col bg-background font-sans">
      <div className="mx-auto mt-4 flex w-full max-w-lg justify-end px-4">
        <SignOutButton />
      </div>
      <KakeiboApp />
    </div>
  );
}
