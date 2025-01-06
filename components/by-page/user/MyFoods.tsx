"use client";

import { useUserFoods } from "@/app/data/foods/useUserFoods";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { useQueryClient } from "@tanstack/react-query";
import MyFoodRow from "./MyFoodRow";

export default function MyFoods({ onCloseModal }) {
  const { data: userFoods, isLoading } = useUserFoods();

  console.log(userFoods);

  return (
    <>
      <div className="relative">
        <div className="font-bold text-xl mb-10 text-center">
          Meus Alimentos
        </div>
        <div className="flex flex-col gap-2 mb-2">
          {!!userFoods?.length
            ? userFoods?.map((food) => <MyFoodRow key={food.id} food={food} />)
            : "Nenhum Alimento encontrado"}
        </div>
        <Modal.Open opens="create-food">
          <button type="button" className="text-darkgreen pl-2 mb-6">
            + Criar Alimento
          </button>
        </Modal.Open>
        <Button
          size="small"
          cw="lightred"
          onClick={() => onCloseModal("my-foods")}
        >
          Fechar{" "}
        </Button>
      </div>
    </>
  );
}
