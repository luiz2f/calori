"use client";
import { duplicateDiet as duplicateDietAPI } from "@/actions/diets/diets";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDuplicateDiet() {
  const queryClient = useQueryClient();

  const { isPending: isDuplicating, mutate: duplicateDiet } = useMutation({
    mutationFn: duplicateDietAPI,
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries([`meals-diet-${data}`]);
      queryClient.invalidateQueries({
        queryKey: ["diets"],
      });
    },
  });

  return { isDuplicating, duplicateDiet };
}
