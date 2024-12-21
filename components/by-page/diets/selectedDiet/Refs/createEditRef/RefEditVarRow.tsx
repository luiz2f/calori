import ConfirmDelete from "@/components/ui/ConfirmDelete";
import Menus from "@/components/ui/Menu";
import Modal from "@/components/ui/Modal";
import {
  HiDotsVertical,
  HiOutlinePencilAlt,
  HiOutlineTrash,
} from "react-icons/hi";

export default function RefEditVarRow({
  refvar,
  onClick,
  onDelete,
  onSelectVariation,
  index,
}) {
  const modalName = `deleteMealVar1${refvar.id}`;

  function handleDeleteMeal() {
    onDelete(refvar.id);
  }
  const handleClick = (e) => {
    e.stopPropagation();
    onSelectVariation(index);
  };
  return (
    <div
      key={refvar.name}
      className="flex gap-2 border-greylight border-b-1 py-1"
      onClick={onClick}
    >
      <div
        onClick={(e) => handleClick(e)}
        className="underline underline-offset-4 text-darkgreen w-full p-1 pl-2 rounded-lg"
      >
        {refvar.name}
      </div>
      <div className="w-fit text-center text-darkgreen p-1 rounded-lg font-medium">
        {refvar.kcal}
      </div>
      <Menus.Menu className="rounded-lg ">
        <Menus.Toggle
          id={refvar.name}
          className="flex items-center justify-center w-8 h-8 rounded-lg p-1"
        >
          <HiDotsVertical />
        </Menus.Toggle>

        <Menus.List id={refvar.name}>
          <Menus.Button icon={<HiOutlinePencilAlt />}>
            Editar variação
          </Menus.Button>
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
  );
}
