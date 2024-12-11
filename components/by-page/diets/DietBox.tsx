"use client";
import clsx from "clsx";
import { HiDotsHorizontal } from "react-icons/hi";
const characterLimit = 36;
export default function DietBox({
  name,
  kcal,
  active,
  dieta,
  onClick,
}: {
  name: string;
  kcal: number;
  active: boolean;
  dieta: { name: string; index: number; kcal: number };
  onClick: () => void; // Tipando o evento de clique
}) {
  const adaptedName =
    name.length > characterLimit ? name.slice(0, characterLimit) + "..." : name;

  const borderClass = clsx(
    "w-44 h-24 text-left white flex-shrink-0 rounded-lg p-db ",
    {
      " shadow-dbbd text-darkgreen": active,
      " shadow-dbde text-blacklight   ": !active,
    }
  );
  return (
    <button className={borderClass} onClick={onClick}>
      <div className="flex justify-between ">
        <div className="text-sm font-medium max-w-32 overflow-hidden ellipsis h-14">
          {adaptedName}
        </div>
        <div>
          <HiDotsHorizontal />
        </div>
      </div>
      <div className="font-bold  align-bottom text-right">
        {kcal} <span className="text-xs">kcal</span>
        {/* 📌 TODO - inter font*/}
      </div>
    </button>
  );
}
