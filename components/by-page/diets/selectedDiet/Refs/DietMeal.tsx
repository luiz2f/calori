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
import { deleteMeal } from "@/actions/diets/meals";
import { useDietContext } from "@/app/context/useDietContext";

export default function DietMeal({ meal }) {
  const { setMeals } = useDietContext();

  const handleDeleteMeal = async () => {
    try {
      await deleteMeal(meal.id);
      setMeals((prevMeals) => prevMeals.filter((m) => m.id !== meal.id));
    } catch (error) {
      console.error(error);
    }
  };

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
            <Modal.Open opens={`deleteMeal${meal.id}`}>
              <Menus.Button icon={<HiOutlineTrash />}>
                Apagar refeição
                {/* confirm ⛔ */}
                {/* action 🐥 */}
              </Menus.Button>
            </Modal.Open>
          </Menus.List>
          <Modal.Window name={`editMeal${meal.id}`}>
            <EditRef />
          </Modal.Window>
          <Modal.Window name={`deleteMeal${meal.id}`}>
            <ConfirmDelete
              resource="Refeição"
              resourceName={`${meal.name} - ${meal.time}`}
              onConfirm={handleDeleteMeal}
              modalName={`deleteMeal${meal.id}`}
            />
          </Modal.Window>
        </Menus.Menu>
        <RefTableTest />
        {/* 😀 */}
      </div>
    </div>
  );
}
