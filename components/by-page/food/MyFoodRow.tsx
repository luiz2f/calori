import { useDeleteFood } from "@/app/data/foods/useDeleteFood";
import ConfirmDelete from "@/components/ui/ConfirmDelete";
import Menus from "@/components/ui/Menu";
import Modal from "@/components/ui/Modal";
import { HiDotsVertical, HiOutlinePencilAlt } from "react-icons/hi";
import { HiOutlineTrash } from "react-icons/hi2";
import CreateEditFood from "../food/CreateEditFood";

export default function MyFoodRow({ food }) {
  const { isDeleting, deleteFood, isSuccess } = useDeleteFood();

  const deleteModal = `deleteUserFood${food?.id}`;
  const editModal = `editUserFood${food?.id}`;
  return (
    <div
      key={food.id}
      className="gap-2 flex items-center p-1 pl-2 justify-between rounded-lg border-grey10 border-1 "
    >
      <div>{food.name}</div>

      <Menus.Menu className=" p-1 rounded-lg text-grey50 ">
        <Menus.Toggle
          id={`userFoodMenuToogle${food?.id}`}
          className="rounded-lg items-center"
        >
          <HiDotsVertical />
        </Menus.Toggle>

        <Menus.List id={`userFoodMenuToogle${food?.id}`}>
          <Modal.Open opens={editModal}>
            <Menus.Button icon={<HiOutlinePencilAlt />}>
              Editar alimento
            </Menus.Button>
          </Modal.Open>
          <Modal.Open opens={deleteModal}>
            <Menus.Button icon={<HiOutlineTrash />}>
              Apagar alimento
            </Menus.Button>
          </Modal.Open>
        </Menus.List>
        <Modal.Window name={editModal}>
          <CreateEditFood
            editing={true}
            foodInfo={food}
            modalName={editModal}
          />
        </Modal.Window>
        <Modal.Window name={deleteModal}>
          <ConfirmDelete
            loading={isDeleting}
            loaded={!isDeleting && isSuccess}
            disabled={isDeleting}
            resource="Alimento"
            resourceName={food.name}
            onConfirm={() => deleteFood(food?.id)}
            modalName={deleteModal}
          />
        </Modal.Window>
      </Menus.Menu>
    </div>
  );
}
