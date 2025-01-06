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
  size,
  ...props
}: Readonly<{
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  cw?: "light" | "green" | "darkgreen" | "lightred" | "red" | "grey";
  size?: "normal" | "small";
  className?: string;
}>) {
  const buttonClass = clsx(className, basicButtonClass, {
    "bg-white text-darkgreen border-darkgreen": cw === "light",
    "bg-actiongreen text-white border-actiongreen": cw === "green",
    "bg-darkgreen text-white border-darkgreen": cw === "darkgreen",
    "bg-white text-blacklight border-blacklight": cw === "grey",
    "bg-white text-darkred border-darkred": cw === "lightred",
    "bg-darkred text-white border-darkred": cw === "red",
    "!text-base !h-fit !py-2": size === "small",
  });

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    if (type !== "submit") {
      e.preventDefault();
    }
    onClick?.();
  }

  return (
    <button
      className={buttonClass}
      onClick={(e) => handleClick(e)}
      disabled={disabled}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
