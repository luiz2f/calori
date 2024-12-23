"use client";
import { useSearchParams } from "next/navigation";
import DietName from "./selectedDiet/DietName";
import DietMacros from "./selectedDiet/Macros/DietMacros";
import DietMealsPage from "./selectedDiet/Refs/DietMealsPage";
import { useDietContext } from "@/app/context/useDietContext";
import { useMeals } from "@/app/data/meals/useMeals";
import { useDiets } from "@/app/data/diets/useDiets";

export default function SelectedDiet({ serverData }) {
  const { diets, defaultDiet, empty } = serverData;
  const { selectedDiet: selectedDietContext } = useDietContext();
  const selectedDietServer = defaultDiet?.id;
  const dietId = selectedDietContext || selectedDietServer;

  const { data: dietsSlider } = useDiets();
  const {
    data: diet,
    isLoading,
    isSuccess,
  } = useMeals(serverData?.defaultDiet, dietId);
  const selectedDietName = dietsSlider.filter((obj) => obj.id === dietId)[0]
    ?.name;

  const name = selectedDietName || diet?.name;
  if (dietsSlider?.length === 0) {
    return (
      <div className="w-full flex flex-col h-full text-center">
        <DietName name="Crie sua primeira dieta para começar" />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col h-full">
      <DietName />
      <DietMacros />
      <DietMealsPage
        key={dietId}
        meals={diet?.meals}
        dietId={dietId}
        diets={diets}
        name={name}
      />
    </div>
  );
}

// 📌 - DELETAR REFEIÇÃO
// 📌 - CRIAR REFEIÇÃO
