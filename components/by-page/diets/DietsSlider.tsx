"use client";

import { useEffect, useState } from "react";
import DietBox from "./DietBox";
import AddDiet from "./dietSlider/AddDiet";
import Modal from "@/components/ui/Modal";
import Menus from "@/components/ui/Menu";
import CreateDiet from "./dietSlider/createEditModal/CreateDiet";
import { useDietContext } from "@/app/context/useDietContext";
import { useDiets } from "@/app/data/diets/useDiets";

export default function DietsSlider({ initialDataDiets }) {
  const { data: diets, isLoading } = useDiets(initialDataDiets);
  const [active, setActive] = useState(0);
  const { setSelectedDiet } = useDietContext();
  const handleDietClick = (dietId) => {
    setSelectedDiet(dietId);
    setActive(dietId);
  };

  return (
    <>
      <Modal>
        <Menus>
          <div className="mt-14 flex flex-col w-full pt-8 bg-white z-10">
            <div className="pl-6">Minhas Dietas</div>
            <div className="flex w-full overflow-x-auto gap-4 px-6 pt-2 pb-4">
              {diets?.map((diet, index) => (
                <DietBox
                  name={diet?.name}
                  kcal={diet?.kcal}
                  diet={diet}
                  active={active === index || active === diet?.id}
                  key={diet.id}
                  onClick={() => handleDietClick(diet.id)} // Evento de clique para selecionar
                />
              ))}

              <Modal.Open opens="new-diet">
                <button>
                  <AddDiet />
                </button>
              </Modal.Open>

              <Modal.Window name="new-diet">
                <CreateDiet modalName="new-diet" />
              </Modal.Window>
            </div>
          </div>
        </Menus>
      </Modal>
    </>
  );
}

// 📌 - DELETAR DIETA
// 📌 - CRIAR REFEIÇÃO
