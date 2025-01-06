"use client";

import { updateFood as updateFoodAPI } from "@/actions/foods";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateFood() {
  const queryClient = useQueryClient();
  const {
    isPending: isUpdating,
    isSuccess,
    mutate: updateFood,
  } = useMutation({
    mutationFn: updateFoodAPI,
    onSuccess: (data) => {
      queryClient.setQueryData(["foods"], (oldFoods) => {
        return oldFoods.map((food) =>
          food.id === data.id ? { ...food, ...data } : food
        );
      });

      queryClient.setQueryData(["userFoods"], (oldUserFoods) => {
        return oldUserFoods.map((food) =>
          food.id === data.id ? { ...food, ...data } : food
        );
      });
    },
  });

  return { isUpdating, isSuccess, updateFood };
}
