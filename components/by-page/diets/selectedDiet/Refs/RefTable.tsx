"use client";
import { useState } from "react";
import Table from "./RefTableModel";
import RefSlider from "./RefSlider";

export default function RefTable({ currentIndex, goLeft, goRight, mealsList }) {
  if (!mealsList || mealsList.length === 0) {
    return null;
  }

  const meal = mealsList[currentIndex];

  function transformFoodData(foodData) {
    return foodData?.map((item) => {
      const { food, unity, quantity } = item;

      const carb = Math.round(food.carb * (quantity * unity.unitMultiplier));
      const protein = Math.round(
        food.protein * (quantity * unity.unitMultiplier)
      );
      const fat = Math.round(food.fat * (quantity * unity.unitMultiplier));
      const kcal = Math.round((carb + protein) * 4 + fat * 9);

      return {
        name: food.name,
        carb: carb,
        protein: protein,
        fat: fat,
        kcal: kcal,
        quantity: quantity,
        unit: unity.un.replace(/"/g, ""), // Remove aspas se houver
      };
    });
  }

  const simplifiedData = transformFoodData(meal?.mealListItems);

  return (
    <Table columns="1fr 32px 32px 32px 32px">
      <Table.Header name={meal?.name} carbo={58} prot={25} fat={8} kcal={419} />

      <Table.Body
        data={simplifiedData}
        render={(item, index) => (
          <Table.Row
            name={item.name}
            carbo={item.carb}
            prot={item.protein}
            fat={item.fat}
            kcal={item.kcal}
            key={index}
          ></Table.Row>
        )}
      />
      <RefSlider
        onLeft={goLeft}
        onRight={goRight}
        length={mealsList?.length}
        current={currentIndex}
      />
    </Table>
  );
}
