"use client";
import { updateWeight as updateWeightAPI } from "@/actions/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateWeight() {
  const queryClient = useQueryClient();

  const {
    isPending,
    mutate: updateWeight,
    isError,
  } = useMutation({
    mutationFn: updateWeightAPI,

    onSuccess: (data) => {
      queryClient.setQueryData(["userWeight"], data);
    },
  });

  return { isPending, updateWeight, isError };
}
