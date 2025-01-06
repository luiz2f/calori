"use client";
import { userWeight } from "@/actions/user";
import { useQuery } from "@tanstack/react-query";

export function useWeight() {
  const { data, isLoading } = useQuery({
    queryKey: ["userWeight"],
    queryFn: userWeight,
  });

  return { data, isLoading };
}
