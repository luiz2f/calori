import Button from "@/components/ui/Button";
import Menus from "@/components/ui/Menu";
import { ModalContext } from "@/components/ui/Modal";
import { useContext } from "react";
import DietEditRefRow from "./DietEditRefRow";

const refs = [
  { name: "Refeição 1", time: "07:00" },
  { name: "Refeição 2", time: "08:00" },
  { name: "Refeição 3", time: "09:00" },
];

export default function EditDiet() {
  const { close } = useContext(ModalContext);

  return (
    <Menus>
      <div>
        <div className="font-bold text-xl mb-10 text-center">Editar Dieta</div>
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
          {refs?.map((ref, index) => {
            return <DietEditRefRow key={index} ref={ref} />;
          })}
        </div>
        <button className="text-darkgreen pl-2 mb-6">+ Adicionar Nova</button>
        <div className="flex gap-4 px-1">
          <Button size="small" cw="lightred" onClick={() => close()}>
            Cancelar
          </Button>
          <Button size="small">Salvar</Button>
        </div>
      </div>
    </Menus>
  );
}
