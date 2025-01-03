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

export default function DietMeal({ meal }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [defaultIndex, setDefaultIndex] = useState(true);
  const { isDeleting, deleteMeal, isSuccess } = useDeleteMeal();
  const { updateMacroForMeal } = useMacroContext();
  const selectedMeal = meal.mealList[currentIndex];

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
    if (currentIndex === 0 && defaultIndex) {
      return;
    }
    setDefaultIndex(false);
    const macro = selectedMeal?.macro;
    updateMacroForMeal(meal.id, macro, "dietMeal");
  }, [currentIndex, meal, defaultIndex]); // Agora depende de `isFirstLoad`

  // console.log(meal);
  const deleteModalName = `deleteMeal${meal.id}`;

  return (
    <div>
      <div className="border-grey10 border-1 rounded-lg flex flex-col w-full relative">
        <div className="flex items-baseline  gap-1 absolute top-[-16px] bg-white px-1 left-0 ">
          <Modal.Open opens={`editMeal${meal.id}`}>
            <button className="font-medium text-2xl cursor-pointer">
              {meal.name}
            </button>
          </Modal.Open>
          <div className="text-darkgreen">{meal.time}</div>
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
              meal={meal}
              currentIndex={currentIndex}
              typeInput="Alimentos"
            />
          </Modal.Window>
          <Modal.Window name={`editMealAlimentoCreate${meal.id}`}>
            <EditRef
              createFood={true}
              meal={meal}
              currentIndex={currentIndex}
              typeInput="Alimentos"
            />
          </Modal.Window>
          <Modal.Window name={`editMealVarCreate${meal.id}`}>
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
          selectedMeal={selectedMeal}
        />
        {/* 😀 */}
      </div>
    </div>
  );
}
