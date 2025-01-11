"use client";
import { createMeal as createMealAPI } from "@/actions/diets/meals";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateMeal() {
  const queryClient = useQueryClient();
  const {
    isPending: isCreating,
    isSuccess,
    mutate: createMeal,
  } = useMutation({
    mutationFn: createMealAPI,
    onSuccess: (data) => {
      // 🏓
      queryClient.invalidateQueries({ queryKey: [`meals-diet-${data}`] });
      queryClient.invalidateQueries({
        queryKey: ["diets"],
      });
    },
    onError: (error) => {
      console.error("useCreateMeal", error);
    },
  });

  return { isCreating, createMeal, isSuccess };
}
