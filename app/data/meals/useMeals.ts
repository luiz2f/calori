"use client";
import { getDietMeals } from "@/actions/diets/meals";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export function useMeals(initialData, dietId) {
  const [initialUsed, setInitialUsed] = useState(false);
  useEffect(() => {
    if (initialData?.id === dietId) {
      setInitialUsed(true);
    }
  }, [initialData, dietId]);

  const { data, isLoading, isSuccess } = useQuery({
    queryKey: [`meals-diet-${dietId}`],
    queryFn: () => getDietMeals(dietId),
    initialData: initialUsed ? undefined : initialData,
  });
  console.log(data);

  return { data, isLoading, isSuccess };
}
