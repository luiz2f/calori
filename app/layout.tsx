import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body className={inter.className}>
          <div className="mx-auto max-w-screen-lg h-screen flex flex-col">
            <Navbar />
            <div className="flex-grow">{children}</div>
          </div>
        </body>
      </html>
    </SessionProvider>
  );
}
