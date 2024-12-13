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

export default function DietRef() {
  // 📌🐪 ORGANIZAR SLIDE, COMO VAI OCORRER
  // 📌🐳 COMPONENTE TABELA + PADDING
  // 📌🐳 3 DOTS?2

  return (
    <div>
      <div className="border-grey10 border-1 rounded-lg flex flex-col w-full relative">
        <div className="flex items-baseline  gap-1 absolute top-[-16px] bg-white px-1 left-0 ">
          <div className="font-medium text-2xl">Café da Manhã</div>
          <div className=" text-darkgreen">(11:00)</div>
        </div>
        <Menus.Menu className="bg-white p-1 rounded-lg border-grey10 border-1  absolute top-[-12px] right-1 text-grey50">
          <Menus.Toggle id="menu-container">
            <HiDotsHorizontal />
          </Menus.Toggle>

          <Menus.List id="menu-container">
            <Modal.Open opens={`editRef`}>
              <Menus.Button icon={<HiOutlinePencilAlt />}>
                Editar refeição
                {/* modal🐥 */}
              </Menus.Button>
            </Modal.Open>
            <Modal.Open opens={`deleteRef`}>
              <Menus.Button icon={<HiOutlineTrash />}>
                Apagar refeição
                {/* confirm ⛔ */}
                {/* action 🐥 */}
              </Menus.Button>
            </Modal.Open>
          </Menus.List>
          <Modal.Window name={`editRef`}>
            <EditRef />
          </Modal.Window>
          <Modal.Window name={`deleteRef`}>
            <ConfirmDelete resource="Refeição" resourceName="Café da Manhã" />
          </Modal.Window>
        </Menus.Menu>
        <RefTableTest />
        {/* 😀 */}
      </div>
    </div>
  );
}
