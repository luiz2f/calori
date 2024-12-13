"use client";

import { useState } from "react";
import DietBox from "./DietBox";
import AddDiet from "./dietSlider/AddDiet";
import Modal from "@/components/ui/Modal";
import Menus from "@/components/ui/Menu";
import CreateDiet from "./dietSlider/createEditModal/CreateDiet";

const diets = [
  {
    name: "Dieta A Nome muito grande exemssssssssssssssssssssplo",
    index: 2,
    kcal: 2321,
  },
  { name: "Dieta B", index: 3, kcal: 1721 },
  { name: "Dieta C", index: 4, kcal: 1721 },
  { name: "Dieta D", index: 1, kcal: 2128 },
];

export default function DietsSlider() {
  const sortedDiets = [...diets].sort((a, b) => a.index - b.index); // Ordena pelo index
  const [selectedDiet, setSelectedDiet] = useState(1);

  const handleDietClick = (index: number) => {
    setSelectedDiet(index); // Atualiza o estado quando uma dieta é clicada
  };
  // TODO 📌 ONHOLD MUDAR INDEX
  // 📌🐳 modal
  // 📌🐪 buscar
  // 📌🐳 opções do modal
  return (
    <Modal>
      <Menus>
        <div className="mt-14 flex flex-col w-full pt-8 bg-white z-10">
          <div className="pl-6">Minhas Dietas</div>
          <div className="flex w-full overflow-x-auto gap-4 px-6 pt-2 pb-4">
            {sortedDiets.map((dieta, index) => {
              return (
                <DietBox
                  name={dieta.name}
                  kcal={dieta.kcal}
                  dieta={dieta}
                  active={selectedDiet === dieta.index}
                  key={index}
                  onClick={() => handleDietClick(dieta.index)} // Evento de clique para selecionar
                />
              );
            })}

            <Modal.Open opens="new-diet">
              <button>
                {/* ainda não sei pq só funciona com o botão */}
                <AddDiet />
              </button>
            </Modal.Open>

            <Modal.Window name="new-diet">
              <CreateDiet />
            </Modal.Window>
          </div>
        </div>
      </Menus>
    </Modal>
  );
}
