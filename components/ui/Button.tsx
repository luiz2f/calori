"use client";
import clsx from "clsx";
import React from "react";

export const basicButtonClass =
  "w-full h-[54px] text-xl py-3 px-6 rounded-lg border fontweight-bold cursor-pointer text-center transition-all duration-fast ease disabled:cursor-not-allowed disabled:border-greylight disabled:bg-greylight disabled:text-grey50";

export default function Button({
  children,
  onClick,
  disabled,
  type = "button",
  cw = "green",
  className,
  ...props
}: Readonly<{
  children: React.ReactNode;
  onClick?: () => void; // Agora opcional
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  cw?: "light" | "green" | "darkgreen" | "lightred" | "red" | "grey";
  className?: string;
}>) {
  const buttonClass = clsx(className, basicButtonClass, {
    "bg-white text-darkgreen border-darkgreen": cw === "light",
    "bg-actiongreen text-white border-actiongreen": cw === "green",
    "bg-darkgreen text-white border-darkgreen": cw === "darkgreen",
    "bg-white text-blacklight border-blacklight": cw === "grey",
    "bg-white text-darkred border-darkred": cw === "lightred",
    "bg-reddark text-white border-reddark": cw === "red",
  });

  return (
    <button
      className={buttonClass}
      onClick={onClick}
      disabled={disabled}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
