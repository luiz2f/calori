"use client";
import Menus from "@/components/ui/Menu";
import RefTableTest from "./RefTable";
import {
  HiDotsHorizontal,
  HiOutlinePencilAlt,
  HiOutlineTrash,
} from "react-icons/hi";
import Modal from "@/components/ui/Modal";
import ConfirmDelete from "@/components/ui/ConfirmDelete";
import EditRef from "./createEditRef/EditRef";
import { useEffect, useState } from "react";
import RefTable from "./RefTable";
import { useDeleteMeal } from "@/app/data/meals/useDeleteMeal";
import { useMacroContext } from "@/app/context/useMacroContext";

export default function DietMeal({ meal, macros }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { isDeleting, deleteMeal, isSuccess } = useDeleteMeal();
  const { updateMacroForMeal } = useMacroContext();

  const goLeft = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : meal?.mealList?.length - 1
    );
  };
  const goRight = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < meal?.mealList?.length - 1 ? prevIndex + 1 : 0
    );
  };
  const handleDeleteMeal = async () => {
    await deleteMeal(meal.id);
  };

  useEffect(() => {
    if (!meal.mealList.length) {
      return;
    }
    const selectedVariation = meal.mealList[currentIndex];
    const macro = selectedVariation.mealListItems.reduce(
      (acc, item) => {
        acc.carbo += item.food.carb * item.quantity * item.unity.unitMultiplier;
        acc.prot +=
          item.food.protein * item.quantity * item.unity.unitMultiplier;
        acc.gord += item.food.fat * item.quantity * item.unity.unitMultiplier;
        acc.kcal +=
          item.food.carb * item.quantity * item.unity.unitMultiplier * 4 +
          item.food.protein * item.quantity * item.unity.unitMultiplier * 4 +
          item.food.fat * item.quantity * item.unity.unitMultiplier * 9;
        return acc;
      },
      { carbo: 0, prot: 0, gord: 0, kcal: 0 }
    );
    updateMacroForMeal(meal.id, macro);
  }, [currentIndex, meal]);

  const deleteModalName = `deleteMeal${meal.id}`;

  return (
    <div>
      <div className="border-grey10 border-1 rounded-lg flex flex-col w-full relative">
        <div className="flex items-baseline  gap-1 absolute top-[-16px] bg-white px-1 left-0 ">
          <div className="font-medium text-2xl">{meal.name}</div>
          <div className=" text-darkgreen">{meal.time}</div>
        </div>
        <Menus.Menu className="bg-white p-1 rounded-lg border-grey10 border-1  absolute top-[-12px] right-1 text-grey50">
          <Menus.Toggle id={`MealToogle${meal.id}`}>
            <HiDotsHorizontal />
          </Menus.Toggle>

          <Menus.List id={`MealToogle${meal.id}`}>
            <Modal.Open opens={`editMeal${meal.id}`}>
              <Menus.Button icon={<HiOutlinePencilAlt />}>
                Editar refeição
                {/* modal🐥 */}
              </Menus.Button>
            </Modal.Open>
            <Modal.Open opens={deleteModalName}>
              <Menus.Button icon={<HiOutlineTrash />}>
                Apagar refeição
                {/* confirm ⛔ */}
                {/* action 🐥 */}
              </Menus.Button>
            </Modal.Open>
          </Menus.List>
          <Modal.Window name={`editMeal${meal.id}`}>
            <EditRef meal={meal} currentIndex={currentIndex} />
          </Modal.Window>
          <Modal.Window name={`editMealAlimento${meal.id}`}>
            <EditRef
              createFood={true}
              meal={meal}
              currentIndex={currentIndex}
              typeInput="Alimentos"
            />
          </Modal.Window>
          <Modal.Window name={`editMealVar${meal.id}`}>
            <EditRef
              createVariation={true}
              meal={meal}
              currentIndex={currentIndex}
              typeInput="Alimentos"
            />
          </Modal.Window>
          <Modal.Window name={deleteModalName}>
            <ConfirmDelete
              loading={isDeleting}
              loaded={!isDeleting && isSuccess}
              resource="Refeição"
              resourceName={`${meal.name} - ${meal.time}`}
              onConfirm={handleDeleteMeal}
              modalName={deleteModalName}
            />
          </Modal.Window>
        </Menus.Menu>
        <RefTable
          mealId={meal?.id}
          currentIndex={currentIndex}
          goLeft={goLeft}
          goRight={goRight}
          mealsList={meal?.mealList}
          macros={macros?.macro}
        />
        {/* 😀 */}
      </div>
    </div>
  );
}
