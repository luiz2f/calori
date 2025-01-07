"use client";

import { updateFood as updateFoodAPI } from "@/actions/foods";
import { useMacroContext } from "@/app/context/useMacroContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateFood() {
  const queryClient = useQueryClient();
  const { updateMacros } = useMacroContext();
  const {
    isPending: isUpdating,
    isSuccess,
    mutate: updateFood,
    reset,
  } = useMutation({
    mutationFn: updateFoodAPI,
    onSuccess: (data) => {
      console.time("Tempo de Execução");
      queryClient.setQueryData(["foods"], (oldFoods) => {
        return oldFoods?.map((food) =>
          food.id === data.id ? { ...food, ...data } : food
        );
      });
      queryClient.setQueryData(["userFoods"], (oldUserFoods) => {
        return oldUserFoods?.map((food) =>
          food.id === data.id ? { ...food, ...data } : food
        );
      });
      const allMealsQueries = queryClient
        .getQueriesData()
        .filter(([queryKey]) => queryKey[0].startsWith("meals"));

      // Atualiza os dados de cada query
      allMealsQueries.forEach(([queryKey, queryData]) => {
        // Percorre as refeições dentro de cada query
        queryData.meals.forEach((meal) => {
          // Atualiza a lista de refeições
          meal.mealList.forEach((mealItem) => {
            mealItem.mealListItems.forEach((item) => {
              if (item.foodId === data.id) {
                // Substitui as informações do item na query
                item.food = data;
                item.unity = data.unities[0]; // Substitui a unidade

                // Atualiza os dados da query com o item modificado
                queryClient.setQueryData(queryKey, {
                  ...queryData, // mantém os outros dados da query
                  meals: queryData.meals, // atualiza a lista de refeições
                });
              }
            });
          });
        });
      });

      updateMacros();
      console.timeEnd("Tempo de Execução");
    },
    onError: (error) => {
      console.log("useUpdateFood", error);
    },
  });

  return { isUpdating, isSuccess, updateFood, reset };
}
