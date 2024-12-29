"use client";
import Menus from "@/components/ui/Menu";
import AddRef from "./AddRef";
import DietMeal from "./DietMeal";
import Modal from "@/components/ui/Modal";
import EditRef from "./createEditRef/EditRef";
import { useDeleteDiet } from "@/app/data/diets/useDeleteDiet";
import ConfirmDelete from "@/components/ui/ConfirmDelete";

export default function DietMealsPage({ meals, dietId, name }) {
  const { isDeleting, deleteDiet, isSuccess } = useDeleteDiet();
  const handleDeleteDiet = async () => {
    await deleteDiet(dietId);
  };

  return (
    <Modal>
      <Menus>
        <div className="flex flex-col w-full p-4 gap-12 mt-6 ">
          {meals?.map((meal, index) => (
            <DietMeal key={meal.id} meal={meal} index={index} />
          ))}
          <AddRef dietId={dietId} />
        </div>
      </Menus>
      <Modal.Open opens={`deleteDietG${dietId}`}>
        <div className="text-center mt-4 mb-4 underline-offset-2 underline cursor-pointer text-darkred">
          Apagar Dieta
        </div>
      </Modal.Open>

      <Modal.Window name={`deleteDietG${dietId}`}>
        <ConfirmDelete
          loading={isDeleting}
          loaded={!isDeleting && isSuccess}
          resource="Dieta"
          resourceName={`${name}`}
          onConfirm={handleDeleteDiet}
          modalName={`deleteDietG${dietId}`}
        />
      </Modal.Window>
      <Modal.Window name={"createNewMeal"}>
        <EditRef
          dietFromId={dietId}
          creating={true}
          createVariation={true}
          meal={null}
          currentIndex={0}
          typeInput="Alimentos"
        />
      </Modal.Window>
    </Modal>
  );
}
