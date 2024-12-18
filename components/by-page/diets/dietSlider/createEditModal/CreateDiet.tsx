"use client";
import { useState, useContext, useEffect, useCallback } from "react";
import Button from "@/components/ui/Button";
import Menus from "@/components/ui/Menu";
import { ModalContext } from "@/components/ui/Modal";
import DietEditRefRow from "./DietEditRefRow";
import { useFormStatus } from "react-dom";
import { v4 as uuidv4 } from "uuid";
import Spinner from "@/components/ui/Spinner";
import { useSession } from "next-auth/react";
import { useCreateDiet } from "@/app/data/diets/useCreateDiet";

const BaseRefs = [
  { id: "1", name: "Café da Manhã", time: "09:00" },
  { id: "2", name: "Almoço", time: "12:00" },
  { id: "3", name: "Lanche", time: "17:00" },
  { id: "4", name: "Jantar", time: "20:00" },
  { id: "5", name: "Ceia", time: "22:00" },
];

export default function CreateDiet({ modalName }) {
  const { isCreating, createDiet, isSuccess } = useCreateDiet();
  const { close } = useContext(ModalContext);
  const [dietName, setDietName] = useState("Nova Dieta");
  const [refs, setRefs] = useState(BaseRefs);
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(true);
  const { data } = useSession();
  const userId = data?.userId;
  useEffect(() => {
    if (!isCreating && isSuccess) {
      close(modalName);
    }
  }, [isCreating, isSuccess, close, modalName]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!userId) {
      console.error();
      return;
    }

    console.time("Tempo total para createDiet"); // Inicia o timer

    try {
      await createDiet({
        userId,
        dietName: dietName,
        refs: refs,
      });
    } catch (error) {
      console.error(error);
    }
  }
  console.log(isCreating);
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
    setRefs([...refs, { id: uuidv4(), name: "Nova Refeição", time: "00:00" }]);
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
        <div className="font-bold text-xl mb-10 text-center">Criar Dieta</div>
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
          + Adicionar refeição
        </button>
        <div className="flex gap-4 px-1">
          <Button size="small" cw="lightred" onClick={() => close(modalName)}>
            Cancelar
          </Button>
          <Button
            size="small"
            type="submit"
            disabled={!isFormValid || refs.length === 0}
          >
            Criar dieta
          </Button>
        </div>
      </form>
      {isCreating && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center bg-white w-full h-full bg-opacity-80">
          <Spinner />
        </div>
      )}
    </Menus>
  );
}

// 😎 - Função createDiet
// Implementar
//
