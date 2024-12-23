import { useDeleteDiet } from "@/app/data/diets/useDeleteDiet";
import { useDietContext } from "@/app/context/useDietContext";
import { useDiets } from "../useDiets";

export function useDeleteAndSelectDiet() {
  const { isDeleting, deleteDiet, isSuccess } = useDeleteDiet();
  const { setSelectedDiet } = useDietContext();
  const { data: diets } = useDiets();
  const handleDeleteDiet = async (dietId, diets) => {
    const position = diets.findIndex((diet) => diet.id === dietId);

    // Aguarda a exclusão da dieta
    await deleteDiet(dietId);

    // Determina a nova dieta selecionada
    const newSelectedDiet =
      position > 0
        ? diets[position - 1]?.id // Seleciona a dieta anterior
        : position < diets?.length - 1
        ? diets[position + 1]?.id // Seleciona a próxima dieta
        : null; // Caso contrário, define como null

    // Atualiza o estado de selectedDiet
    setSelectedDiet(newSelectedDiet);
  };

  return { isDeleting, isSuccess, handleDeleteDiet };
}
