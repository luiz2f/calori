"use client";
import { getFoods } from "@/actions/foods";
import { useQuery } from "@tanstack/react-query";

export function useFoods() {
  const { data, isLoading } = useQuery({
    queryKey: ["foods"],
    queryFn: getFoods,
  });

  console.log("usefoods", data);

  return { data, isLoading };
}
