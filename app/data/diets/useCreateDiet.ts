"use client";
import { createDiet as createDietAPI } from "@/actions/diets/diets";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateDiet() {
  const queryClient = useQueryClient();
  console.log(`[${new Date().toLocaleTimeString()}] createDiet Hook`);
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
      console.log("useCreateDiet");
    },
  });

  return { isCreating, createDiet, isSuccess };
}
