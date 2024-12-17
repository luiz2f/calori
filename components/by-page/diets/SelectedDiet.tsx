"use client";

import { getDietMeals } from "@/actions/diets/meals";

import DietName from "./selectedDiet/DietName";
import DietMacros from "./selectedDiet/Macros/DietMacros";
import DietMealsPage from "./selectedDiet/Refs/DietMealsPage";
import { useEffect, useState } from "react";
import { useDietContext } from "@/app/context/useDietContext";

export default function SelectedDiet({ serverData }) {
  const { selectedDiet: selectedDietContext } = useDietContext();
  const [selectedDiet, setSelectedDiet] = useState(serverData?.selectedDiet);
  const [meals, setMeals] = useState(serverData?.meals);
  const dietId = selectedDietContext || selectedDiet?.id;
  const { diets } = serverData;
  console.log(dietId);

  const selectedDietName = diets.filter((obj) => obj.id === dietId)[0]?.name;
  useEffect(() => {
    async function fetchMeals(id) {
      try {
        const data = await getDietMeals(id);
        setMeals(data);
      } catch (error) {
        console.error("Erro ao buscar refeições:", error);
      }
    }
    if (selectedDietContext) {
      setSelectedDiet(selectedDietContext);
      fetchMeals(dietId);
    }
  }, [selectedDietContext, dietId]);

  if (serverData.empty) {
    return (
      <div className="w-full flex flex-col h-full text-center">
        <DietName name="Crie sua primeira dieta para começar" />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col h-full">
      <DietName name={selectedDietName} />
      <DietMacros />
      <DietMealsPage meals={meals} dietId={dietId} />
    </div>
  );
}
