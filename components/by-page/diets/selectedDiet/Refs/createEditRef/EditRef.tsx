"use client";
import Button from "@/components/ui/Button";
import Menus from "@/components/ui/Menu";
import { ModalContext } from "@/components/ui/Modal";
import { useContext, useState } from "react";
import EditRefList from "./EditRefList";
import EditRefFoods from "./EditRefFoods";
import Toogle from "@/components/ui/Toogle";

const refvars = [
  { name: "Leite com Banana", kcal: "341" },
  { name: "Pão com ovo", kcal: "450" },
  { name: "Vitamina de Abacate", kcal: "502" },
];

export default function EditRef() {
  const [type, setType] = useState<"Lista" | "Alimentos">("Alimentos");
  const { close } = useContext(ModalContext);

  console.log(type);

  const toggleType = (type: "Lista" | "Alimentos") => {
    setType(type);
  };
  return (
    <Menus>
      <div>
        <div className="font-bold text-xl  text-center">Editar Refeição</div>
        <div className="text-base mb-3 text-grey50 text-center">
          Nome da Dieta
        </div>
        <Toogle
          options={["Lista", "Alimentos"]}
          value={type}
          onChange={toggleType}
          className="mb-7"
        />

        <div className="flex gap-2 mb-3">
          <div className=" relative w-full">
            <label className="absolute top-[-6px] text-grey50 px-1 ml-1 text-sm bg-white line leading-3">
              Nome da Refeição
            </label>
            <input
              value="Nome da Refeição"
              className=" p-2 w-full border-1 border-grey-50   rounded-lg "
            />
          </div>
          <div className=" relative">
            <label className="absolute top-[-6px] text-grey50 px-1 ml-1 text-sm bg-white line leading-3">
              Horário
            </label>
            <input
              value="11:00"
              className="font-medium p-2 w-16 border-1 border-grey-50 text-darkgreen text-center rounded-lg "
            />
          </div>
        </div>
        {type === "Lista" ? (
          <EditRefList refvars={refvars} />
        ) : (
          <EditRefFoods />
        )}
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
