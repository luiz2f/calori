"use client";
import { createFood as createFoodAPI, FoodInput } from "@/actions/foods";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type CreateFoodReturn = {
  foodId: string | null;
  foodRowId: string | null;
};

export function useCreateFood({
  shouldReturn = false,
}: {
  shouldReturn: boolean;
}) {
  const queryClient = useQueryClient();
  const diets = queryClient.getQueryData(["diets"]);
  let userId: string;
  if (diets && Array.isArray(diets)) {
    userId = diets[0]?.userId || "";
  }

  const {
    isPending: isCreating,
    isSuccess,
    mutate: createFood,
  } = useMutation({
    mutationFn: (data: FoodInput) => createFoodAPI(data, userId),
    onSuccess: (data) => {
      queryClient.setQueryData(["foods"], (oldFoods) => {
        return [...(Array.isArray(oldFoods) ? oldFoods : []), data];
      });
      queryClient.setQueryData(["userFoods"], (oldUserFoods) => {
        return [...(Array.isArray(oldUserFoods) ? oldUserFoods : []), data];
      });
      if (shouldReturn) {
        const returnFood = queryClient.getQueryData<
          CreateFoodReturn | undefined
        >(["createFoodReturn"]);

        if (returnFood && returnFood?.foodRowId && "id" in data) {
          const newReturnFood = { ...returnFood, foodId: data.id };
          queryClient.setQueryData(["createFoodReturn"], newReturnFood);
        }
      }
    },

    onError: (error) => {
      console.error("useCreateFood", error);
    },
  });

  return { isCreating, createFood, isSuccess };
}
