import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { signIn, signOut, auth } from "@/auth";
import Link from "next/link";
import "./globals.css";
import UserButton from "./components/UserButton";

export const metadata: Metadata = {
  title: "SandyGPT Chat",
  description: "SandyGPT Chat brought to you by NextJS",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await auth();
  if (session?.user) {
    session.user = {
      name: session.user.name,
      username: session.user.username,
      image: session.user.image,
    };
  }
  return (
    <SessionProvider basePath="/api/auth" session={session}>
      <html lang="en">
        <body
          className={`antialiased px-2 md:px-5`}
        >
          <header className="bg-white border-b border-gray-200 shadow-md">
            <div className="max-w-6xl mx-auto px-5 py-4 flex justify-between items-center">
              <div className="text-xl font-bold text-gray-800">
                <Link href="/">SandyGPT</Link>
              </div>

              <nav className="flex space-x-4">
                <Link
                  href="/"
                  className="text-gray-600 hover:text-gray-900 font-medium transition"
                >
                  Home
                </Link>
                <Link
                  href="/about-us"
                  className="text-gray-600 hover:text-gray-900 font-medium transition"
                >
                  About Us
                </Link>

              </nav>
              <div>
                <UserButton
                  onSignIn={async () => {
                    "use server";
                    await signIn();
                  }}
                  onSignOut={async () => {
                    "use server";
                    await signOut();
                  }}
                />
              </div>
            </div>
          </header>

          <main className="flex flex-col md:flex-row">
            <div className="flex-grow">
              {children}
            </div>
          </main>
        </body>
      </html >
    </SessionProvider>
  );
}
