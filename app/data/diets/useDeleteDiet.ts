"use client";
import { deleteDiet as deleteDietAPI } from "@/actions/diets/diets";
import { useDietContext } from "@/app/context/useDietContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteDiet() {
  const { selectedDiet, setSelectedDiet } = useDietContext();
  const queryClient = useQueryClient();

  const {
    isPending: isDeleting,
    mutate: deleteDiet,
    isSuccess,
  } = useMutation({
    mutationFn: deleteDietAPI,
    onSuccess: (data) => {
      const queryKey = `meals-diet-${data}`;
      queryClient.removeQueries({ queryKey, exact: true });
      const diets = queryClient.getQueryData(["diets"]);
      console.log(data, selectedDiet, "DATA E SELECTED DIET");
      console.log(data === selectedDiet, "DATA E SELECTED DIET");
      if (selectedDiet === data) {
        const selectedIndex = diets.findIndex(
          (diet) => diet.id === selectedDiet
        );
        console.log("INDEX", selectedIndex);
        console.log("LENGHT");
        if (diets?.length === 1) {
          setSelectedDiet(null);
        } else if (selectedIndex >= diets?.length - 1) {
          const newIndex = diets?.length - 2;
          setSelectedDiet(diets[newIndex]?.id);
          console.log("NEW INDEX", newIndex, diets[newIndex]?.name);
        } else {
          const newIndex = selectedIndex + 1;
          setSelectedDiet(diets[newIndex]?.id);
        }
        // setSelectedDiet(newDiet?.id);
      }
      queryClient.invalidateQueries({
        queryKey: ["diets"],
      });
    },
  });

  return { isDeleting, deleteDiet, isSuccess };
}
