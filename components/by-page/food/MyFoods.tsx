"use client";

import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import MyFoodRow from "./MyFoodRow";

export default function MyFoods({ onCloseModal, userFoods, isLoading }) {
  return (
    <>
      <div className="relative">
        <div className="font-bold text-xl mb-8 text-center">Meus Alimentos</div>
        <div className="flex flex-col gap-2 mb-2">
          {!!userFoods?.length ? (
            userFoods?.map((food) => <MyFoodRow key={food.id} food={food} />)
          ) : (
            <div className="text-center text-lightblack">
              Nenhum Alimento encontrado
            </div>
          )}
        </div>
        <Modal.Open opens="create-food">
          <button
            type="button"
            className="text-darkgreen pl-2 mb-8 flex mx-auto text-bold underline"
          >
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
