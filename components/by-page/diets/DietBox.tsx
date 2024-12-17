"use client";
import Menus from "@/components/ui/Menu";
import Modal from "@/components/ui/Modal";
import clsx from "clsx";
import {
  HiDotsHorizontal,
  HiOutlineDuplicate,
  HiOutlinePencilAlt,
  HiOutlineTrash,
} from "react-icons/hi";
import ConfirmDelete from "@/components/ui/ConfirmDelete";
import EditDiet from "./dietSlider/createEditModal/EditDiet";
import { deleteDiet, duplicateDiet } from "@/actions/diets/diets";
import { useDietContext } from "@/app/context/useDietContext";
import { useEffect } from "react";

export const dynamic = "force-dynamic";

const characterLimit = 36;

export default function DietBox({
  name,
  kcal,
  active,
  diet,
  onClick,
}: {
  name: string;
  kcal: number;
  active: boolean;
  diet: any;
  onClick: () => void; // Tipando o evento de clique
}) {
  const adaptedName =
    name.length > characterLimit ? name.slice(0, characterLimit) + "..." : name;
  // db: "10px 12px 6px 12px",

  const borderClass = clsx(
    "flex flex-col cursor-pointer justify-between w-44 h-24 text-left  white flex-shrink-0 rounded-lg p-db ",
    {
      " shadow-dbbd text-darkgreen": active,
      " shadow-dbde text-blacklight   ": !active,
    }
  );

  const handleDeleteDiet = async () => {
    try {
      await deleteDiet(diet.id);
    } catch (error) {
      console.error(error);
    }
  };
  const handleDuplicateDiet = async () => {
    try {
      await duplicateDiet(diet.id);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={borderClass} onClick={onClick}>
      <div className="flex justify-between w-full">
        <div className="text-sm font-medium max-w-32 overflow-hidden ellipsis h-14 pt-2">
          {adaptedName}
        </div>
        <Menus.Menu>
          <Menus.Toggle id={`DietToogle${diet.id}`} className="p-3">
            <HiDotsHorizontal />
          </Menus.Toggle>

          <Menus.List id={`DietToogle${diet.id}`}>
            <Modal.Open opens={`edit ${name}`}>
              <Menus.Button icon={<HiOutlinePencilAlt />}>
                Editar dieta
                {/* modal🐥 */}
              </Menus.Button>
            </Modal.Open>
            <Menus.Button
              icon={<HiOutlineDuplicate />}
              onClick={handleDuplicateDiet}
            >
              Duplicar dieta
              {/* action 🐥 */}
            </Menus.Button>
            <Modal.Open opens={`deleteDiet${diet.id}`}>
              <Menus.Button icon={<HiOutlineTrash />}>
                Apagar dieta
                {/* confirm ⛔ */}
                {/* action 🐥 */}
              </Menus.Button>
            </Modal.Open>
          </Menus.List>
        </Menus.Menu>
        <Modal.Window name={`deleteDiet${diet.id}`}>
          <ConfirmDelete
            resource="Dieta"
            resourceName={`${name}`}
            onConfirm={handleDeleteDiet}
            modalName={`deleteDiet${diet.id}`}
          />
        </Modal.Window>
        <Modal.Window name={`edit ${name}`}>
          <EditDiet />
        </Modal.Window>
      </div>
      <div className="font-bold pr-3 w-full align-bottom text-right">
        {kcal ? (
          <span>
            {kcal} <span className="text-xs">kcal</span>
          </span>
        ) : (
          ""
        )}
        {/* 📌 TODO - inter font*/}
      </div>
    </div>
  );
}
