"use client";
import { duplicateDiet as duplicateDietAPI } from "@/actions/diets/diets";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDuplicateDiet() {
  const queryClient = useQueryClient();

  const { isPending: isDuplicating, mutate: duplicateDiet } = useMutation({
    mutationFn: duplicateDietAPI,
    onSuccess: (data) => {
      queryClient.setQueryData([`meals-diet-${data?.id}`], data);

      queryClient.invalidateQueries({
        queryKey: ["diets"],
      });
      console.log("useDuplicateDiet");
    },
  });

  return { isDuplicating, duplicateDiet };
}
