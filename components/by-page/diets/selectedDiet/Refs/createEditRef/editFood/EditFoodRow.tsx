import ConfirmDelete from "@/components/ui/ConfirmDelete";
import Menus from "@/components/ui/Menu";
import Modal from "@/components/ui/Modal";
import {
  HiDotsHorizontal,
  HiDotsVertical,
  HiOutlineDuplicate,
  HiOutlineTrash,
} from "react-icons/hi";

export default function EditFoodRow({ food }) {
  return (
    <>
      <input
        value={food.quant}
        className="border-1 py-[2px] text-center border-grey50  rounded-lg"
      />
      <input
        value={food.unit}
        className="border-1 text-center border-grey50  rounded-lg"
      />
      <input
        value={food.name}
        className="border-1 text-center border-grey50 w-full rounded-lg"
      />
      <Menus.Menu>
        <Menus.Toggle
          id={`editreffood ${food.name}`}
          className="p-1  rounded-lg "
        >
          <HiDotsVertical />
        </Menus.Toggle>

        <Menus.List id={`editreffood ${food.name}`}>
          <Menus.Button icon={<HiOutlineDuplicate />}>
            Duplicar alimento
            {/* action 🐥 */}
          </Menus.Button>
          <Modal.Open opens={`deletereffood ${food.name}`}>
            <Menus.Button icon={<HiOutlineTrash />}>
              Apagar alimento
              {/* confirm ⛔ */}
              {/* action 🐥 */}
            </Menus.Button>
          </Modal.Open>
        </Menus.List>
      </Menus.Menu>
      <Modal.Window name={`deletereffood ${food.name}`}>
        {/* action 🐥 */}

        <ConfirmDelete resource="Alimento" resourceName={food.name} />
      </Modal.Window>
    </>
  );
}
