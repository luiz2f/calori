"use client";
import { createFood as createFoodAPI } from "@/actions/foods";
import { ModalContext } from "@/components/ui/Modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext, useEffect } from "react";

export function useCreateFood() {
  const { close } = useContext(ModalContext);
  const queryClient = useQueryClient();
  const userId = queryClient.getQueryData(["diets"])[0].userId || null;
  const foods = queryClient.getQueryData(["foods"]);

  const {
    isPending: isCreating,
    isSuccess,
    mutate: createFood,
  } = useMutation({
    mutationFn: (data) => createFoodAPI(data, userId),
    onSuccess: (data) => {
      queryClient.setQueryData(["foods"], (oldFoods) => {
        return [...oldFoods, data];
      });

      // Atualiza a query de 'userFoods' caso o alimento seja do usuário
      queryClient.setQueryData(["userFoods"], (oldUserFoods) => {
        return [...oldUserFoods, data];
      });
    },
  });

  // useEffect(() => {
  //   if (!isCreating && isSuccess) {
  //     close("create-food");
  //   }
  // }, [isCreating, isSuccess, close]);

  return { isCreating, createFood, isSuccess };
}
