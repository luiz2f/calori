"use client";
import { updateMeal as updateMealAPI } from "@/actions/diets/meals";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateMeal() {
  const queryClient = useQueryClient();
  const {
    isPending: isUpdating,
    isSuccess,
    mutate: updateMeal,
    reset,
  } = useMutation({
    mutationFn: updateMealAPI,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [`meals-diet-${data}`] });
      queryClient.invalidateQueries({
        queryKey: ["diets"],
      });
    },
    onError: (error) => {
      console.error("useUpdateMeal", error);
    },
  });
  return { isUpdating, updateMeal, isSuccess, reset };
}
