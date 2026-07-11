import LoginForm from "@/components/LoginForm";

type Props = {
  searchParams?: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const params = searchParams ? await searchParams : undefined;

  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-background px-4 py-8">
      <LoginForm error={params?.error} />
    </div>
  );
}
