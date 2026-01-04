import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import LogoutButton from "@/components/logout-button";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-col items-center gap-8 py-32 px-16 bg-white dark:bg-black sm:items-start rounded-xl shadow-sm">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />

        <div className="space-y-4">
          <h1 className="text-2xl font-bold">
            Welcome to Next.js 16 Auth Demo
          </h1>
          {user ? (
            <div className="space-y-4">
              <div className="rounded-lg bg-gray-100 p-4 dark:bg-zinc-800">
                <p className="font-medium">User: {user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
                <pre className="mt-2 text-xs overflow-auto max-w-[300px]">
                  {JSON.stringify(user, null, 2)}
                </pre>
              </div>
              <LogoutButton />
            </div>
          ) : (
            <div className="flex gap-4">
              <Link
                href="/login"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100 py-2.5"
              >
                Create account <span aria-hidden="true">→</span>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
