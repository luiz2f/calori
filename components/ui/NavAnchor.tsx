"use client";
import Link from "next/link";

export default function NavAnchor({
  href,
  children,
}: Readonly<{
  children: React.ReactNode;
  href: string;
}>) {
  return (
    <Link href={href} className="text-center mt-2 underline text-darkgreen">
      {children}
    </Link>
  );
}
