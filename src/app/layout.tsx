import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "./components/SessionProvider";
import UserButton from "./components/UserButton";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SandyGPT Chat",
  description: "SandyGPT Chat brought to you by NextJS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased px-2 md:px-5`}
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
                <UserButton />
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
