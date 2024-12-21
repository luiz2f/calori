"use client";
import { createDiet as createDietAPI } from "@/actions/diets/diets";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateMeal() {
  const queryClient = useQueryClient();
  const {
    isPending: isCreating,
    isSuccess,
    mutate: createDiet,
  } = useMutation({
    mutationFn: createDietAPI,
    onSuccess: (data) => {
      queryClient.setQueryData([`meals-diet-${data?.id}`], data);
      queryClient.invalidateQueries({
        queryKey: ["diets"],
      });
    },
  });

  return { isCreating, createDiet, isSuccess };
}
