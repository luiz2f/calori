"use client";
import { updateWeight as updateWeightAPI } from "@/actions/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateWeight() {
  const queryClient = useQueryClient();

  const {
    isPending,
    mutate: updateWeight,
    isSuccess,
    reset,
    isError,
  } = useMutation({
    mutationFn: updateWeightAPI,

    onSuccess: (data) => {
      queryClient.setQueryData(["userWeight"], data);
    },
    onError: (error) => {
      console.error("useUpdateWeight", error);
    },
  });

  return { isPending, updateWeight, isSuccess, reset, isError };
}
