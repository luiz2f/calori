"use client";
import { createDiet as createDietAPI } from "@/actions/diets/diets";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateDiet() {
  const queryClient = useQueryClient();
  const {
    isPending: isCreating,
    isSuccess,
    mutate: createDiet,
  } = useMutation({
    mutationFn: createDietAPI,
    onSuccess: () => {
      // queryClient.setQueryData([`meals-diet-${data?.id}`], data);
      // 🏓🏓
      queryClient.invalidateQueries({
        queryKey: ["diets"],
      });
    },
    onError: (error) => {
      console.error("useCreateDiet", error);
    },
  });

  return { isCreating, createDiet, isSuccess };
}
