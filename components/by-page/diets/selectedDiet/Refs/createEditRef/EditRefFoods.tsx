import { useState, useEffect } from "react";
import RefSlider from "../RefSlider";
import EditFoodRow from "./editFood/EditFoodRow";
import Modal from "@/components/ui/Modal";
import ConfirmDelete from "@/components/ui/ConfirmDelete";
import { useFoods } from "@/app/data/foods/useFoods";

export default function EditRefFoods({
  mealsList,
  currentIndex,
  onDeleteVariation,
  onFoodChange,
  onNameChange,
  setIndex,
  handleAddVariation,
  handleAddFood,
  deleteFoodFromMeal,
  handleDuplicateFood,
}) {
  const currentMeal = mealsList[currentIndex];
  const [variationName, setVariationName] = useState(currentMeal?.name || "");
  const { data: foods } = useFoods();

  const modalName = `deleteMeal${currentMeal?.id}`;
  function handleDeleteMeal() {
    onDeleteVariation(currentMeal?.id);
  }
  useEffect(() => {
    setIndex(currentIndex);
    if (currentMeal) {
      setVariationName(currentMeal?.name);
    } else {
      setVariationName("");
    }
  }, [currentIndex, mealsList, setIndex, setVariationName]);
  const goLeft = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : mealsList.length - 1;
    const newName = mealsList[newIndex]?.name || "";
    setIndex(newIndex);
    setVariationName(newName);
  };
  const goRight = () => {
    const newIndex = currentIndex < mealsList.length - 1 ? currentIndex + 1 : 0;
    const newName = mealsList[newIndex]?.name || "";

    setIndex(newIndex);
    setVariationName(newName);
  };
  const handleNameChange = (e) => {
    const newName = e.target.value;
    setVariationName(newName);
    onNameChange(currentMeal?.id, newName);
  };
  const refFoods = currentMeal?.mealListItems || [];
  const handleFoodChangeWrapper = (foodId, data) => {
    onFoodChange(currentMeal?.id, foodId, data);
  };

  return (
    <>
      {!!mealsList.length ? (
        <>
          <RefSlider
            onLeft={goLeft}
            onRight={goRight}
            length={mealsList.length}
            current={currentIndex}
          />
          <div className="flex gap-2 my-1 mt-7">
            <div className="relative w-full">
              <label className="absolute top-[-6px] text-grey50 px-1 ml-1 text-sm bg-white line leading-3">
                Nome da Variação
              </label>
              <input
                value={variationName}
                onChange={handleNameChange}
                className="p-2 w-full border-1 border-grey-50 text-darkgreen rounded-lg"
              />
            </div>
            <div className="grid pl-1 grid-cols-frq gap-3 text-center text-darkgreen">
              <div className="flex flex-col justify-end align-bottom relative">
                <div className="grayscale contrast-150 text-xs opacity-50">
                  🍞
                </div>
                <div>48</div>
                <div className="absolute top-[-18px] left-0 right-0 text-xs text-grey50">
                  +13
                </div>
              </div>
              <div className="flex flex-col justify-end align-bottom relative">
                <div className="grayscale contrast-150 text-xs opacity-50">
                  🥩
                </div>
                <div>28</div>
                <div className="absolute top-[-18px] left-0 right-0 text-xs text-grey50">
                  +8
                </div>
              </div>
              <div className="flex flex-col justify-end align-bottom relative">
                <div className="grayscale contrast-150 text-xs opacity-50">
                  🥑
                </div>
                <div>7</div>
                <div className="absolute top-[-18px] left-0 right-0 text-xs text-grey50">
                  +1
                </div>
              </div>
              <div className="flex flex-col justify-end align-bottom relative">
                <div className="text-xs text-grey50">kcal</div>
                <div>315</div>
                <div className="absolute top-[-18px] left-0 right-0 text-xs text-grey50">
                  +13
                </div>
              </div>
            </div>
          </div>
          {refFoods.length > 0 ? (
            <>
              <div className="grid grid-cols-edref gap-2 text-center text-sm text-grey30 mb-1">
                <div>Quant.</div>
                <div>Un.</div>
                <div>Alimento</div>
                <div></div>
              </div>
              <div
                className={`w-full border-y-1 border-lightgreen text-sm mb-2 flex-1 `}
              >
                <div className="h-[inherit]  w-full py-3 grid grid-cols-edref gap-2">
                  {refFoods?.map((food, index) => (
                    <EditFoodRow
                      mealId={currentMeal?.id}
                      onDeleteFood={deleteFoodFromMeal}
                      key={`${food.id}-${index}-${currentMeal?.id}`}
                      food={food}
                      onFoodChange={handleFoodChangeWrapper}
                      duplicateFood={() =>
                        handleDuplicateFood(currentMeal?.id, food.id)
                      }
                      foods={foods}
                    />
                  ))}
                </div>
              </div>
            </>
          ) : (
            ""
          )}
          <div className="flex justify-between mb-7">
            <div
              onClick={() => handleAddFood(currentMeal?.id)}
              className={`text-darkgreen text-sm cursor-pointer ml-2 ${
                !refFoods.length && "underline underline-offset-4"
              }`}
            >
              {!refFoods.length
                ? "+ Adicionar primeiro alimento"
                : "+ Adicionar Alimento"}
            </div>

            <Modal.Open opens={modalName}>
              <button className="text-sm pl-3 text-darkred  cursor-pointer">
                Apagar variação
              </button>
            </Modal.Open>
            <Modal.Window name={modalName}>
              <ConfirmDelete
                resource="Variação de Refeição"
                resourceName={variationName}
                onConfirm={handleDeleteMeal}
                modalName={modalName}
              />
            </Modal.Window>
          </div>
        </>
      ) : (
        <>
          <div className="text-grey50 text-sm mb-1 pl-2">Variações</div>
          <div className="flex flex-col mb-3"></div>
          <button
            onClick={(e) => handleAddVariation(e)}
            className="cursor-pointer text-xl text-center pl-2 mb-6 mt-1 underline  underline-offset-4 text-darkgreen"
          >
            + Adicionar Variação de Refeição
          </button>
        </>
      )}
    </>
  );
}
