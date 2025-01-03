"use client";
import { createMeal as createMealAPI } from "@/actions/diets/meals";
import { ModalContext } from "@/components/ui/Modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext, useEffect } from "react";

export function useCreateMeal() {
  const { close } = useContext(ModalContext);
  const queryClient = useQueryClient();
  const {
    isPending: isCreating,
    isSuccess,
    mutate: createMeal,
  } = useMutation({
    mutationFn: createMealAPI,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [`meals-diet-${data}`] });
      // queryClient.invalidateQueries({
      //   queryKey: ["diets"],
      // });
    },
  });

  useEffect(() => {
    if (!isCreating && isSuccess) {
      close("createNewMeal");
    }
  }, [isCreating, isSuccess, close]);

  return { isCreating, createMeal, isSuccess };
}
