"use client";

import { deleteFood as deleteFoodAPI } from "@/actions/foods";
import { Food } from "@/app/(authenticated)/app";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export function useDeleteFood() {
  const [deletedId, setDeletedId] = useState<string>();
  const queryClient = useQueryClient();
  const {
    isPending: isDeleting,
    isSuccess,
    mutate: deleteFood,
  } = useMutation({
    mutationFn: deleteFoodAPI,
    onSuccess: (data) => {
      const id = data?.id;
      if (!id) {
        queryClient.invalidateQueries({
          queryKey: ["foods"],
        });
      } else {
        setDeletedId(id);
      }
    },
    onError: (error) => {
      console.error("useDeleteFood", error);
    },
  });

  // manual delete from cache

  useEffect(() => {
    if (!isDeleting && isSuccess && deletedId) {
      queryClient.setQueryData<Food[]>(["foods"], (oldFoods) => {
        return oldFoods?.filter((food) => food?.id !== deletedId);
      });
      queryClient.setQueryData<Food[]>(["userFoods"], (oldUserFoods) => {
        return oldUserFoods?.filter((food) => food?.id !== deletedId);
      });
    }
  }, [isDeleting, isSuccess, deletedId, queryClient]);

  return { isDeleting, isSuccess, deleteFood };
}
