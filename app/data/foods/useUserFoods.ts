"use client";
import { getUserFoods } from "@/actions/foods";
import { useQuery } from "@tanstack/react-query";

export function useUserFoods() {
  const { data, isLoading } = useQuery({
    queryKey: ["userFoods"],
    queryFn: getUserFoods,
    refetchOnMount: false,
  });

  return { data, isLoading };
}
