"use client";
import { useSearchParams } from "next/navigation";
import DietName from "./selectedDiet/DietName";
import DietMacros from "./selectedDiet/Macros/DietMacros";
import DietMealsPage from "./selectedDiet/Refs/DietMealsPage";
import { useDietContext } from "@/app/context/useDietContext";
import { useMeals } from "@/app/data/meals/useMeals";
import { useDiets } from "@/app/data/diets/useDiets";
import { useMacroContext } from "@/app/context/useMacroContext";
import { useEffect } from "react";
import { Diet } from "@/app/(authenticated)/app";

export default function SelectedDiet({ serverData }) {
  const { defaultDiet }: { defaultDiet: Diet } = serverData;
  const { selectedDiet: selectedDietContext } = useDietContext();
  const { setDefaultMacro } = useMacroContext();
  const selectedDietServer = defaultDiet?.id;
  const dietId = selectedDietContext || selectedDietServer;
  const { data: dietsSlider } = useDiets();
  const { data: diet, isLoading } = useMeals(dietId, serverData?.defaultDiet);
  const selectedDietName = dietsSlider?.filter((obj) => obj.id === dietId)[0]
    ?.name;
  const name = selectedDietName || diet?.name || "";

  useEffect(() => {
    if (diet) {
      setDefaultMacro(diet);
    }
  }, [diet]);

  if (dietsSlider?.length === 0) {
    return (
      <div className="w-full flex flex-col h-full text-center">
        <DietName name="Crie sua primeira dieta para começar" />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col h-full">
      <DietName name={name} />
      <DietMacros />
      <DietMealsPage
        isLoading={isLoading}
        key={dietId}
        meals={diet?.meals}
        dietId={dietId}
        name={name}
      />
    </div>
  );
}

// 📌 - DELETAR REFEIÇÃO
// 📌 - CRIAR REFEIÇÃO
