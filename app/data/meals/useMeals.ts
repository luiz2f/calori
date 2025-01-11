"use client";
import { getDietMeals } from "@/actions/diets/meals";
import { Diet, MealList } from "@/app/(authenticated)/app";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

export const calculateMacros = (variation: MealList) => {
  console.log(variation);
  let carb = 0;
  let prot = 0;
  let fat = 0;
  let kcal = 0;
  if (!!variation?.mealListItems?.length) {
    variation.mealListItems.forEach((item) => {
      carb +=
        (item?.food?.carb ?? 0) *
        item.quantity *
        (item?.unity?.unitMultiplier ?? 0);
      prot +=
        (item?.food?.protein ?? 0) *
        item.quantity *
        (item?.unity?.unitMultiplier ?? 0);
      fat +=
        (item?.food?.fat ?? 0) *
        item.quantity *
        (item?.unity?.unitMultiplier ?? 0);
    });

    carb = Math.round(carb);
    prot = Math.round(prot);
    fat = Math.round(fat);
    kcal = Math.round((carb + prot) * 4 + fat * 9);
  }

  return { carb, prot, fat, kcal };
};

export function useMeals(dietId: string, inputInitialData?: Diet) {
  const [initialUsed, setInitialUsed] = useState(false);
  useEffect(() => {
    if (inputInitialData?.id === dietId) {
      setInitialUsed(true);
    }
  }, [inputInitialData, dietId]);

  const queryObk = !initialUsed ? { initialData: inputInitialData } : {};
  // Não faço ideia do motivo, mas foi a única forma de não ter erro no type e as meals carregarem antes do Query
  // rever
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: [`meals-diet-${dietId}`],
    queryFn: () => getDietMeals(dietId),
    ...queryObk,
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
