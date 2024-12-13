import Button from "@/components/ui/Button";
import Menus from "@/components/ui/Menu";
import {
  HiDotsVertical,
  HiOutlinePencilAlt,
  HiOutlineTrash,
} from "react-icons/hi";

const refs = [
  { name: "Refeição 1", time: "07:00" },
  { name: "Refeição 2", time: "08:00" },
  { name: "Refeição 3", time: "09:00" },
];

export default function CreateDiet() {
  return (
    <Menus>
      <div>
        <div className="font-bold text-xl mb-10 text-center">Criar Dieta</div>
        <div className=" relative">
          <label className="absolute top-[-6px] text-grey50 px-1 ml-1 text-sm bg-white line leading-3">
            Nome da dieta
          </label>
          <input
            value="Nome da Dieta"
            className="font-medium p-2 w-full border-1 border-grey-50   rounded-lg mb-3"
          />
        </div>
        <label className="text-grey50 text-sm mb-1 pl-2">Refeições</label>
        <div className="flex flex-col gap-2 mb-3">
          {refs.map((ref, index) => {
            return (
              <div key={index} className="flex gap-2">
                <input
                  value={ref.name}
                  className="border-1 border-grey-50 w-full p-1 pl-2 rounded-lg"
                />
                <input
                  value={ref.time}
                  className="border-1 border-grey-50 w-14 text-center text-darkgreen p-1 rounded-lg font-medium"
                />
                <Menus.Menu className="border-1 border-grey-50 rounded-lg align-center">
                  <Menus.Toggle
                    id={ref.name}
                    className="flex items-center justify-center  w-8 h-8 rounded-lg p-1"
                  >
                    <HiDotsVertical />
                  </Menus.Toggle>

                  <Menus.List id={ref.name}>
                    <Menus.Button icon={<HiOutlinePencilAlt />}>
                      Editar refeição
                      {/* modal🐥 */}
                    </Menus.Button>

                    <Menus.Button icon={<HiOutlineTrash />}>
                      Apagar refeição
                      {/* confirm ⛔ */}
                      {/* action 🐥 */}
                    </Menus.Button>
                  </Menus.List>
                </Menus.Menu>
              </div>
            );
          })}
        </div>
        <button className="text-darkgreen pl-2 mb-6">+ Adicionar Nova</button>
        <div className="flex gap-4 px-1">
          <Button size="small" cw="lightred">
            Cancelar
          </Button>
          <Button size="small">Criar dieta</Button>
        </div>
      </div>
    </Menus>
  );
}
