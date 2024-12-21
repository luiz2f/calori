"use client";
import { updateDiet as updateDietAPI } from "@/actions/diets/diets";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateDiet() {
  const queryClient = useQueryClient();
  const {
    isPending: isUpdating,
    isSuccess,
    mutate: updateDiet,
  } = useMutation({
    mutationFn: updateDietAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["diets"],
      });
    },
  });

  return { isUpdating, updateDiet, isSuccess };
}
