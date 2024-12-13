"use client";
import { HiOutlinePlus } from "react-icons/hi";
// 📌🐪 fazer criar
// 📌🐳 modal
// 📌🐳 janela do modal

export default function AddDiet() {
  return (
    <div className="w-44 h-24  flex-shrink-0 rounded-lg p-db shadow-dbde text-blacklight">
      <div className="flex flex-col h-full items-center justify-center ">
        <div className="text-sm mb-1 font-medium max-w-32 ">
          Adicionar Dieta
        </div>
        <div>
          <HiOutlinePlus className="h-4 w-4 width text-darkgreen" />
        </div>
      </div>
    </div>
  );
}
