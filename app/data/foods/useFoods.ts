"use client";
import { getFoods } from "@/actions/foods";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export function useFoods() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["foods"],
    queryFn: getFoods,
  });

  useEffect(() => {
    if (data) {
      const userFoods = data.filter((food) => food?.userFood === true);
      queryClient.setQueryData(["userFoods"], userFoods);
    }
  }, [data, queryClient]);

  return { data, isLoading };
}
