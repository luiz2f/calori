"use client";
import { duplicateDiet as duplicateDietAPI } from "@/actions/diets/diets";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDuplicateDiet() {
  const queryClient = useQueryClient();

  const { isPending: isDuplicating, mutate: duplicateDiet } = useMutation({
    mutationFn: duplicateDietAPI,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [`meals-diet-${data}`] });
      queryClient.invalidateQueries({
        queryKey: ["diets"],
      });
    },
    onError: (error) => {
      console.error("useDuplicateDiet", error);
    },
  });

  return { isDuplicating, duplicateDiet };
}
