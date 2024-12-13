import Menus from "@/components/ui/Menu";
import {
  HiDotsVertical,
  HiOutlinePencilAlt,
  HiOutlineTrash,
} from "react-icons/hi";

export default function RefEditVarRow({ refvar }) {
  return (
    <div
      key={refvar.name}
      className="flex gap-2  border-greylight border-b-1 py-1 "
    >
      <div className="underline underline-offset-4 text-darkgreen w-full p-1 pl-2 rounded-lg">
        {refvar.name}
      </div>
      <div className=" w-fit text-center text-darkgreen p-1 rounded-lg font-medium">
        {refvar.kcal}
      </div>
      <Menus.Menu className="rounded-lg align-center">
        <Menus.Toggle
          id={refvar.name}
          className="flex items-center justify-center  w-8 h-8 rounded-lg p-1"
        >
          <HiDotsVertical />
        </Menus.Toggle>

        <Menus.List id={refvar.name}>
          <Menus.Button icon={<HiOutlinePencilAlt />}>
            Editar variação
            {/* modal🐥 */}
          </Menus.Button>

          <Menus.Button icon={<HiOutlineTrash />}>
            Apagar variação
            {/* confirm ⛔ */}
            {/* action 🐥 */}
          </Menus.Button>
        </Menus.List>
      </Menus.Menu>
    </div>
  );
}
