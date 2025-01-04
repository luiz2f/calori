"use client";
import ConfirmDelete from "@/components/ui/ConfirmDelete";
import Menus from "@/components/ui/Menu";
import Modal from "@/components/ui/Modal";
import {
  HiDotsVertical,
  HiOutlineDuplicate,
  HiOutlinePencilAlt,
  HiOutlineTrash,
} from "react-icons/hi";

export default function RefEditVarRow({
  canDuplicate,
  refvar,
  onDelete,
  onSelectVariation,
  index,
  onDuplicateVariation,
}) {
  const modalName = `deleteMealVar1${refvar.id}`;

  const handleDeleteMeal = () => {
    onDelete(refvar.id);
  };
  const handleClick = (e) => {
    e.stopPropagation();
    selectVariation();
  };

  const selectVariation = () => {
    onSelectVariation(index);
  };

  return (
    <div
      key={refvar.name}
      className="flex gap-2 cursor-pointer justify-between border-greylight border-b-1 py-1"
      onClick={handleClick}
    >
      <div
        onClick={(e) => handleClick(e)}
        className="w-fit underline underline-offset-4 text-darkgreen  p-1 pl-2 rounded-lg"
      >
        {refvar.name}
      </div>
      <div className="flex">
        <div className="w-fit text-center text-darkgreen p-1 rounded-lg font-medium">
          {refvar.kcal}
        </div>
        <Menus.Menu className="rounded-lg">
          <Menus.Toggle
            id={refvar.id}
            className="flex items-center justify-center w-8 h-8 rounded-lg p-1"
          >
            <HiDotsVertical />
          </Menus.Toggle>

          <Menus.List id={refvar.id}>
            <Menus.Button
              icon={<HiOutlinePencilAlt />}
              onClick={selectVariation}
            >
              Editar variação
            </Menus.Button>
            {canDuplicate && (
              <Menus.Button
                icon={<HiOutlineDuplicate />}
                onClick={() => onDuplicateVariation(refvar?.id)}
              >
                Duplicar variação
              </Menus.Button>
            )}

            <Modal.Open opens={modalName}>
              <Menus.Button icon={<HiOutlineTrash />}>
                Apagar variação
              </Menus.Button>
            </Modal.Open>
          </Menus.List>

          <Modal.Window name={modalName}>
            <ConfirmDelete
              resource="Variação de Refeição"
              resourceName={`${refvar.name}`}
              onConfirm={handleDeleteMeal}
              modalName={modalName}
            />
          </Modal.Window>
        </Menus.Menu>
      </div>
    </div>
  );
}
