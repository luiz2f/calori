"use client";

import { DietProvider } from "@/app/context/useDietContext";
import { MacroProvider } from "@/app/context/useMacroContext";
import Menus from "@/components/ui/Menu";
import Modal from "@/components/ui/Modal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React, { useEffect, useMemo } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60 * 1000 * 7 },
  },
});

export default function App({ empty, defaultDiet, diets, foods, children }) {
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

  const props = useMemo(
    () => ({ empty, defaultDiet, diets, foods, number: 3 }),
    [empty, defaultDiet, diets, foods]
  );
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <DietProvider initialDiet={id}>
        <MacroProvider>
          <Modal>
            <Menus>{children}</Menus>
          </Modal>
        </MacroProvider>
      </DietProvider>
    </QueryClientProvider>
  );
}
