"use client";
import { createFood as createFoodAPI } from "@/actions/foods";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateFood({
  shouldReturn = false,
}: {
  shouldReturn: boolean;
}) {
  const queryClient = useQueryClient();
  const userId = queryClient.getQueryData(["diets"])[0].userId || null;

  const {
    isPending: isCreating,
    isSuccess,
    mutate: createFood,
  } = useMutation({
    mutationFn: (data) => createFoodAPI(data, userId),
    onSuccess: (data) => {
      queryClient.setQueryData(["foods"], (oldFoods) => {
        return [...(Array.isArray(oldFoods) ? oldFoods : []), data];
      });
      queryClient.setQueryData(["userFoods"], (oldUserFoods) => {
        return [...(Array.isArray(oldUserFoods) ? oldUserFoods : []), data];
      });
      if (shouldReturn) {
        const returnFood = queryClient.getQueryData(["createFoodReturn"]);
        if (returnFood && returnFood?.foodRowId) {
          const newReturnFood = { ...returnFood, foodId: data.id };
          queryClient.setQueryData(["createFoodReturn"], newReturnFood);
        }
      }
    },

    onError: (error) => {
      console.log("useCreateFood", error);
    },
  });

  return { isCreating, createFood, isSuccess };
}
