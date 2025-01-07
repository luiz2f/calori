"use client";
import { getUserDiets } from "@/actions/diets/diets";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export function useDiets(initialDataDiets = null) {
  const [initialUsed, setInitialUsed] = useState(false);

  useEffect(() => {
    if (initialDataDiets) {
      setInitialUsed(true);
    }
  }, [initialDataDiets]);

  const { data, isLoading } = useQuery({
    queryKey: ["diets"],
    queryFn: getUserDiets,
    initialData: initialUsed ? undefined : initialDataDiets,
  });

  return { data, isLoading };
}
