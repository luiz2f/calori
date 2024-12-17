"use client";
import { getUserDiets } from "@/actions/diets/diets";
import { useQuery } from "@tanstack/react-query";

export function useDiets(initialData) {
  const { data, isLoading } = useQuery({
    queryKey: ["diets"],
    queryFn: getUserDiets,
    initialData,
  });

  return { data, isLoading };
}
