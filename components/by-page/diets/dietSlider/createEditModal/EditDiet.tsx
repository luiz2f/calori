"use client";
import { useState, useContext, useEffect, useCallback } from "react";
import Button from "@/components/ui/Button";
import Menus from "@/components/ui/Menu";
import { ModalContext } from "@/components/ui/Modal";
import DietEditRefRow from "./DietEditRefRow";
import { v4 as uuidv4 } from "uuid";
import Spinner from "@/components/ui/Spinner";
import { useUpdateDiet } from "@/app/data/diets/useUpdateDiet";
import { useCreateDiet } from "@/app/data/diets/useCreateDiet";
import { useSession } from "next-auth/react";

const BaseRefs = [
  { id: "1", name: "Café da Manhã", time: "09:00" },
  { id: "2", name: "Almoço", time: "12:00" },
  { id: "3", name: "Lanche", time: "17:00" },
  { id: "4", name: "Jantar", time: "20:00" },
  { id: "5", name: "Ceia", time: "22:00" },
];

export default function EditDiet({ diet, modalName, creating = false }) {
  const { close, unsavedChanges } = useContext(ModalContext);

  const meals = creating ? BaseRefs : diet?.meals;
  const name = creating ? "Nova Dieta" : diet?.name;
  const modifiedDefault = creating ? true : false;
  const [dietName, setDietName] = useState(name);
  const [refs, setRefs] = useState(meals);
  const [originalRefs, setOriginalRefs] = useState(meals);
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(true);
  const [isModified, setIsModified] = useState(modifiedDefault);
  const { data } = useSession();
  const userId = data?.userId;

  const { isUpdating, updateDiet, isSuccess: isSuccessU } = useUpdateDiet();
  const { isCreating, createDiet, isSuccess: isSuccessC } = useCreateDiet();

  const isLoading = creating ? isCreating : isUpdating;
  const isSuccess = creating ? isSuccessC : isSuccessU;
  const isDisabled = !isFormValid || !isModified || isUpdating;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (creating) {
      try {
        await createDiet({
          userId,
          dietName: dietName,
          refs: refs,
        });
      } catch (error) {
        console.error(error);
      }
    } else {
      updateDiet({ dietName, dietId: diet?.id, refs });
    }
  };

  useEffect(() => {
    if (!isCreating && isSuccess && creating) {
      close(modalName);
    }
  }, [isCreating, isSuccess, close, modalName, creating]);

  useEffect(() => {
    if (meals) {
      setRefs(meals);
      setOriginalRefs(meals);
    }
  }, [meals]);

  useEffect(() => {
    if (!creating) {
      if (isModified) {
        unsavedChanges(modalName);
      } else {
        unsavedChanges("");
      }
    }
  }, [unsavedChanges, modalName, isModified]);

  useEffect(() => {
    // Verifica se houve alterações em relação aos dados originais
    if (!creating) {
      const isModified =
        JSON.stringify(refs) !== JSON.stringify(originalRefs) ||
        dietName !== name;
      setIsModified(isModified);
    }
  }, [refs, dietName, originalRefs, name, creating]);

  useEffect(() => {
    const hasError = Object.values(errors).some(Boolean);
    const hasEmptyName = refs.some((ref) => ref.name.trim() === "");
    setIsFormValid(!hasError && !hasEmptyName);
  }, [errors, refs]);

  const handleNameChange = (e) => {
    setDietName(e.target.value);
  };

  const handleRefChange = (index, key, value) => {
    const newRefs = refs.map((ref, i) =>
      i === index ? { ...ref, [key]: value } : ref
    );
    setRefs(newRefs);

    if (key === "name" && value.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [`${index}_name`]: "Nome não pode estar vazio",
      }));
    } else if (key === "name" && value.trim() !== "") {
      setErrors((prevErrors) => {
        const { [`${index}_name`]: omit, ...rest } = prevErrors;
        return rest;
      });
    }
  };

  const handleErrorChange = (index, key, error) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [`${index}_${key}`]: error,
    }));
  };

  const handleAddRef = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setRefs([...refs, { id: uuidv4(), name: "Nova Refeição", time: "23:00" }]);
  };

  const handleTimeBlur = useCallback(() => {
    const sortedRefs = [...refs].sort((a, b) => {
      const [aHours, aMinutes] = a.time.split(":").map(Number);
      const [bHours, bMinutes] = b.time.split(":").map(Number);
      return aHours - bHours || aMinutes - bMinutes;
    });
    setRefs(sortedRefs);
  }, [refs]);

  const handleDeleteRef = (id) => {
    setRefs((prevRefs) => prevRefs.filter((ref) => ref.id !== id));
  };

  return (
    <Menus>
      <form onSubmit={handleSubmit} className="relative">
        <div className="font-bold text-xl mb-10 text-center">Editar Dieta</div>
        <div className="relative">
          <label className="absolute top-[-6px] text-grey50 px-1 ml-1 text-sm bg-white line leading-3">
            Nome da dieta
          </label>
          <input
            name="dietName"
            value={dietName}
            onChange={handleNameChange}
            className="font-medium p-2 w-full border-1 border-grey-50 rounded-lg mb-3"
          />
        </div>
        <label className="text-grey50 text-sm mb-1 pl-2">Refeições</label>
        <div className="flex flex-col gap-2 mb-3">
          {refs.map((ref, index) => (
            <DietEditRefRow
              key={ref.id}
              refData={ref}
              onRefChange={(key, value) => handleRefChange(index, key, value)}
              onErrorChange={(key, error) =>
                handleErrorChange(index, key, error)
              }
              onTimeBlur={handleTimeBlur}
              nameError={errors[`${index}_name`]}
              timeError={errors[`${index}_time`]}
              onDelete={handleDeleteRef}
              index={index}
            />
          ))}
        </div>
        {refs?.length <= 7 && (
          <button
            type="button"
            className="text-darkgreen pl-2"
            onClick={handleAddRef}
          >
            + Adicionar Nova
          </button>
        )}
        <div className="flex gap-4 px-1 mt-6">
          <Button
            size="small"
            cw="lightred"
            onClick={(e) => {
              e.stopPropagation();
              close(modalName);
            }}
          >
            Cancelar
          </Button>
          <Button size="small" type="submit" disabled={isDisabled}>
            Salvar
          </Button>
        </div>
      </form>
      {isLoading && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center bg-white w-full h-full bg-opacity-80">
          <Spinner />
        </div>
      )}
    </Menus>
  );
}
