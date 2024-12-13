"use client";
import DietName from "./selectedDiet/DietName";
import DietMacros from "./selectedDiet/Macros/DietMacros";
import DietRefsPage from "./selectedDiet/Refs/DietRefsPage";

export default function SelectedDiet() {
  // max characters
  return (
    <div className=" w-full flex flex-col h-full">
      <DietName name="Dieta D" />
      <DietMacros />
      <DietRefsPage />
    </div>
  );
}
