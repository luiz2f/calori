"use client";
import clsx from "clsx";
import Link from "next/link";
import { basicButtonClass } from "./Button";

export default function NavButton({
  children,
  href,
  type = "green",
  ...props
}: Readonly<{
  children: string;
  href: string;
  type?: "light" | "green" | "darkgreen" | "lightred" | "red" | "grey";
}>) {
  const buttonClass = clsx(basicButtonClass, {
    "bg-white text-darkgreen border-darkgreen": type === "light",
    "bg-actiongreen text-white border-actiongreen": type === "green",
    "bg-darkgreen text-white border-darkgreen": type === "darkgreen",
    "bg-white text-blacklight border-blacklight": type === "grey",
    "bg-white text-darkred border-darkred": type === "lightred",
    "bg-reddark text-white border-reddark": type === "red",
  });

  return (
    <Link className={buttonClass} href={href} {...props}>
      {children}
    </Link>
  );
}
