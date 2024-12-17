"use client";

import { createMeal } from "@/actions/diets/meals";
import { useDietContext } from "@/app/context/useDietContext";
import { HiPlus } from "react-icons/hi";

export default function AddRef({ dietId }) {
  const { setSelectedDiet } = useDietContext();

  async function handleAddRef() {
    try {
      await createMeal(dietId, { name: "Nova refeição", time: "23:00" });
      setSelectedDiet(dietId);
    } catch (error) {
      console.error(error);
    }
  }
  // 📌🐪 FUNÇÃO
  // 📌🐳 modal
  // 📌🐳 janela modal
  return (
    <div
      onClick={handleAddRef}
      className="border-grey10 border-1 cursor-pointer h-20 justify-center rounded-lg flex flex-col w-full relative"
    >
      <div className="flex items-baseline  gap-1 absolute top-[-16px] bg-white px-1 left-0 ">
        <div className="font-medium text-2xl">Adicionar Nova Refeição</div>
      </div>
      <HiPlus className="w-7 h-7 mx-auto text-darkgreen" />
    </div>
  );
}
