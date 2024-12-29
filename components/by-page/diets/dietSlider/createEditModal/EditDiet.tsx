"use client";
import { useState, useContext, useEffect, useCallback } from "react";
import Button from "@/components/ui/Button";
import Menus from "@/components/ui/Menu";
import { ModalContext } from "@/components/ui/Modal";
import DietEditRefRow from "./DietEditRefRow";
import { v4 as uuidv4 } from "uuid";
import Spinner from "@/components/ui/Spinner";
import { useUpdateDiet } from "@/app/data/diets/useUpdateDiet";

export default function EditDiet({ diet }) {
  const { closeLast } = useContext(ModalContext);

  const meals = diet?.meals;
  const [dietName, setDietName] = useState(diet.name);
  const [refs, setRefs] = useState(meals || []);
  const [originalRefs, setOriginalRefs] = useState(meals || []);
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(true);
  const [isModified, setIsModified] = useState(false);

  const { isUpdating, isSuccess, updateDiet } = useUpdateDiet();
  useEffect(() => {
    if (meals) {
      setRefs(meals);
      setOriginalRefs(meals);
    }
  }, [meals]);

  useEffect(() => {
    // Verifica se houve alterações em relação aos dados originais
    const isModified =
      JSON.stringify(refs) !== JSON.stringify(originalRefs) ||
      dietName !== diet.name;
    setIsModified(isModified);
  }, [refs, dietName, originalRefs, diet.name]);

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

  const handleAddRef = () => {
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    // useUpdateDiet();
    updateDiet({ dietName, dietId: diet?.id, refs });
    // Lógica para salvar as alterações
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
        <button
          type="button"
          className="text-darkgreen pl-2 mb-6"
          onClick={handleAddRef}
        >
          + Adicionar Nova
        </button>
        <div className="flex gap-4 px-1">
          <Button size="small" cw="lightred" onClick={() => closeLast()}>
            Cancelar
          </Button>
          <Button
            size="small"
            type="submit"
            disabled={!isFormValid || !isModified}
          >
            Salvar
          </Button>
        </div>
      </form>
      {isUpdating && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center bg-white w-full h-full bg-opacity-80">
          <Spinner />
        </div>
      )}
    </Menus>
  );
}
