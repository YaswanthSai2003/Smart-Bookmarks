import Link from "next/link";

export default function AuthCodeErrorPage() {
  return (
    <main className="mx-auto max-w-md p-8">
      <h1 className="text-2xl font-semibold">Login failed</h1>
      <p className="mt-2 text-gray-600">
        Something went wrong during Google sign-in. Please try again.
      </p>

      <Link
        href="/login"
        className="mt-6 inline-block rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800"
      >
        Back to login
      </Link>
    </main>
  );
}
