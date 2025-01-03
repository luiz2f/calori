"use client";

import { DietProvider } from "@/app/context/useDietContext";
import { MacroProvider } from "@/app/context/useMacroContext";
import DietsSlider from "@/components/by-page/diets/DietsSlider";
import SelectedDiet from "@/components/by-page/diets/SelectedDiet";
import Header from "@/components/Header";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60 * 1000 * 7 },
  },
});
export default function App({ empty, defaultDiet, diets, foods }) {
  const { id } = defaultDiet || {};
  useEffect(() => {
    if (diets) {
      queryClient.setQueryData(["diets"], diets);
      queryClient.setQueryData([`meals-diet-${id}`], defaultDiet);
      queryClient.setQueryData(["foods"], foods);
      queryClient.setQueryData(
        ["userFoods"],
        foods.filter((food) => food?.userFood === true)
      );
    }
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <DietProvider initialDiet={id}>
        <MacroProvider>
          <Header />
          <DietsSlider initialDataDiets={diets} />
          <SelectedDiet serverData={{ empty, defaultDiet, diets }} />
        </MacroProvider>
      </DietProvider>
    </QueryClientProvider>
  );
}

// 🍤 - COMEÇAR A FAZER LISTA MINIMALISTA DE COMIDAS PRA PODER FAZER O RESTANTE COM EXEMPLOS REAIS E MAIS APLICADOS PRA EVITAR RETRABALHO

// 📌 -USE CREATE MEALS
// 📌 -USE DELETE MEALS
// 📌 - USE EDIT MEALS-
// 📌 - USE EDIT MODAL CHANGES

// 📌 - SELECT FORM

// 📌 - INDEX POSITION + HOLD AND DRAG
// 📌 - INDEX
