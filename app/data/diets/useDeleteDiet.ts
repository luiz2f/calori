"use client";
import { deleteDiet as deleteDietAPI } from "@/actions/diets/diets";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteDiet() {
  const queryClient = useQueryClient();

  const {
    isPending: isDeleting,
    mutate: deleteDiet,
    isSuccess,
  } = useMutation({
    mutationFn: deleteDietAPI,
    onSuccess: (data) => {
      const queryKey = `meals-diet-${data}`;
      queryClient.removeQueries({ queryKey, exact: true });
      queryClient.invalidateQueries({
        queryKey: ["diets"],
      });
      console.log("useDeleteDiet");
    },
  });

  return { isDeleting, deleteDiet, isSuccess };
}
