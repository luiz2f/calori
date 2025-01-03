"use client";
import { getDietMeals } from "@/actions/diets/meals";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
const calculateMacros = (variation) => {
  let carb = 0;
  let prot = 0;
  let fat = 0;
  let kcal = 0;
  if (!!variation?.mealListItems?.length) {
    variation.mealListItems.forEach((item) => {
      carb += item.food.carb * item.quantity * item.unity.unitMultiplier;
      prot += item.food.protein * item.quantity * item.unity.unitMultiplier;
      fat += item.food.fat * item.quantity * item.unity.unitMultiplier;
    });

    carb = Math.round(carb);
    prot = Math.round(prot);
    fat = Math.round(fat);
    kcal = Math.round((carb + prot) * 4 + fat * 9);
  }

  return { carb, prot, fat, kcal };
};

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

  const mealsWithMacros = useMemo(() => {
    if (data?.meals) {
      return {
        ...data,
        meals: data?.meals?.map((meal) => ({
          ...meal,
          mealList: meal?.mealList?.map((variation) => ({
            ...variation,
            macro: calculateMacros(variation),
          })),
        })),
      };
    }
    return data;
  }, [data]);

  return { data: mealsWithMacros, isLoading, isSuccess };
}
