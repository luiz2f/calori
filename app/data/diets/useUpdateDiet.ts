"use client";
import { updateDiet as updateDietAPI } from "@/actions/diets/diets";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateDiet() {
  const queryClient = useQueryClient();
  const {
    isPending: isUpdating,
    isSuccess,
    mutate: updateDiet,
    reset,
  } = useMutation({
    mutationFn: updateDietAPI,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [`meals-diet-${data.dietId}`],
      });
      queryClient.invalidateQueries({
        queryKey: ["diets"],
      });
    },
    onError: (error) => {
      console.log("useUpdateDiet", error);
    },
  });

  return { isUpdating, updateDiet, isSuccess, reset };
}
