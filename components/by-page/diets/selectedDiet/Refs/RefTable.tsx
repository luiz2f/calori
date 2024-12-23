"use client";
import { useContext } from "react";
import Table from "./RefTableModel";
import RefSlider from "./RefSlider";
import { ModalContext } from "@/components/ui/Modal";

export default function RefTable({
  mealId,
  currentIndex,
  goLeft,
  goRight,
  mealsList,
  modalName,
}) {
  const { open } = useContext(ModalContext);

  if (!mealsList || mealsList.length === 0) {
    return (
      <div role="table" className="flex flex-col w-full p-2 mb-2">
        <div
          role="row"
          style={{ gridTemplateColumns: "1fr 32px 32px 32px 32px" }}
          className="grid mt-4 pr-1 text-darkgreen"
        >
          <div
            className="text-left align-bottom text-xl font-normal self-end pl-1 underline underline-offset-2 cursor-pointer"
            onClick={handleClickNoVar}
          >
            + Adicionar variação de refeição
          </div>
          <div className="text-center font-normal align-bottom opacity-30">
            <div className="grayscale contrast-150 text-xs opacity-30">🍞</div>
            <div>0</div>
          </div>
          <div className="text-center font-normal align-bottom opacity-30">
            <div className="grayscale contrast-150 text-xs opacity-30">🥩</div>
            <div>0</div>
          </div>
          <div className="text-center font-normal align-bottom opacity-30">
            <div className="grayscale contrast-150 text-xs opacity-30">🥑</div>
            <div>0</div>
          </div>
          <div className="text-right font-normal align-bottom opacity-30">
            <div className="text-xs text-grey50">kcal</div> <div>0</div>
          </div>
        </div>
      </div>
    );
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

  function handleClickNoFood() {
    open(`editMealAlimento${mealId}`);
  }

  function handleClickNoVar() {
    open(`editMealVar${mealId}`);
  }

  const simplifiedData = transformFoodData(meal?.mealListItems);
  return (
    <Table columns="1fr 32px 32px 32px 32px">
      <Table.Header name={meal?.name} carbo={58} prot={25} fat={8} kcal={419} />
      <Table.Body>
        {simplifiedData?.length ? (
          simplifiedData.map((item, index) => (
            <Table.Row
              key={index}
              name={item.name}
              carbo={item.carb}
              prot={item.protein}
              fat={item.fat}
              kcal={item.kcal}
            />
          ))
        ) : (
          <Table.NoFood onClick={handleClickNoFood} />
        )}
      </Table.Body>
      <RefSlider
        onLeft={goLeft}
        onRight={goRight}
        length={mealsList?.length}
        current={currentIndex}
      />
    </Table>
  );
}
