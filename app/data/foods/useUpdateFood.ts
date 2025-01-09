"use client";

import { updateFood as updateFoodAPI } from "@/actions/foods";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { calculateMacros } from "../meals/useMeals";

export function useUpdateFood() {
  const queryClient = useQueryClient();
  const {
    isPending: isUpdating,
    isSuccess,
    mutate: updateFood,
    reset,
  } = useMutation({
    mutationFn: updateFoodAPI,
    onSuccess: (data) => {
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
        const updatedMeals = queryData?.meals?.map((meal) => ({
          ...meal,
          mealList: meal.mealList?.map((mealItem) => ({
            ...mealItem,
            mealListItems: mealItem.mealListItems?.map((item) => {
              if (item.foodId === data.id) {
                // Substitui as informações do item na query
                const updatedFood = { ...item.food, ...data };
                return {
                  ...item,
                  food: updatedFood,
                  unity: data.unities[0], // Substitui a unidade
                };
              }
              return item;
            }),
            macro: calculateMacros(mealItem), // Recalcula os macros aqui
          })),
        }));

        // Atualiza a query com as refeições modificadas
        queryClient.setQueryData(queryKey, {
          ...queryData,
          meals: updatedMeals,
        });
      });
    },
    onError: (error) => {
      console.error("useUpdateFood", error);
    },
  });

  return { isUpdating, isSuccess, updateFood, reset };
}
