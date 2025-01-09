"use client";
import { deleteMeal as deleteMealAPI } from "@/actions/diets/meals";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteMeal() {
  const queryClient = useQueryClient();

  const {
    isPending: isDeleting,
    mutate: deleteMeal,
    isSuccess,
  } = useMutation({
    mutationFn: deleteMealAPI,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [`meals-diet-${data}`] });
      queryClient.invalidateQueries({
        queryKey: ["diets"],
      });
    },
    onError: (error) => {
      console.error("useDeleteMeal", error);
    },
  });

  return { isDeleting, deleteMeal, isSuccess };
}
