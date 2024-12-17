"use client";
import Menus from "@/components/ui/Menu";
import AddRef from "./AddRef";
import DietMeal from "./DietMeal";
import Modal from "@/components/ui/Modal";

export default function DietMealsPage({ meals, dietId }) {
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
      <div className="text-center mt-4 mb-4 underline-offset-2 underline text-darkred">
        Apagar Dieta
      </div>
    </Modal>
  );
}
