"use client";
import { useState, useContext, useEffect, use } from "react";
import Button from "@/components/ui/Button";
import Menus from "@/components/ui/Menu";
import Modal, { ModalContext } from "@/components/ui/Modal";
import EditRefList from "./EditRefList";
import EditRefFoods from "./EditRefFoods";
import Toogle from "@/components/ui/Toogle";
import { useDiets } from "@/app/data/diets/useDiets";
import { v4 as uuidv4 } from "uuid";
import { useUpdateMeal } from "@/app/data/meals/useUpdateMeal";
import { useCreateMeal } from "@/app/data/meals/useCreateMeal";
import Spinner from "@/components/ui/Spinner";
import { useFoods } from "@/app/data/foods/useFoods";

export default function EditRef({
  creating = false,
  createVariation = false,
  createFood = false,
  typeInput = "Lista",
  meal,
  currentIndex,
  goLeft,
  goRight,
  dietFromId,
  modalName,
}: {
  dietFromId?: string;
  creating: boolean;
  createVariation: boolean;
  createFood: boolean;
  typeInput?: "Alimentos" | "Lista" | (() => "Alimentos" | "Lista");
  meal: any;
  currentIndex: number;
  goLeft: () => void;
  goRight: () => void;
  modalName: string;
}) {
  const { data: diets } = useDiets();
  const [type, setType] = useState<"Lista" | "Alimentos">(typeInput);
  const [selectedVariation, setSelectedVariation] = useState(currentIndex);
  const { close, unsavedChanges } = useContext(ModalContext);
  const [mealName, setMealName] = useState(
    creating ? "Nova Refeição" : meal?.name
  );
  const [mealTime, setMealTime] = useState(creating ? "23:00" : meal?.time);
  const [mealList, setMealList] = useState(meal?.mealList || []);
  const [originalMealList, setOriginalMealList] = useState(
    meal?.mealList || []
  );
  const [isModified, setIsModified] = useState(false);
  const [errors, setErrors] = useState({ name: "", time: "", food: false });
  const disabled = !!errors.name || !!errors.time;
  const dietId = dietFromId || meal?.dietId;
  const diet = diets.filter((obj) => obj.id === dietId)[0];

  const { isUpdating, updateMeal, isSuccess: isSuccessU } = useUpdateMeal();
  const { isCreating, createMeal, isSuccess: isSuccessC } = useCreateMeal();

  const isLoading = creating ? isCreating : isUpdating;
  const isSuccess = creating ? isSuccessC : isSuccessU;

  useEffect(() => {
    if (isModified) {
      unsavedChanges(modalName);
    } else {
      unsavedChanges(null);
    }
  }, [unsavedChanges, modalName, isModified]);
  useEffect(() => {
    if (meal?.mealList) {
      setMealList(meal?.mealList);
      setOriginalMealList(meal?.mealList);
    }
  }, [meal?.mealList]);

  useEffect(() => {
    const isModified =
      JSON.stringify(mealList) !== JSON.stringify(originalMealList) ||
      mealName !== meal?.name ||
      mealTime !== meal?.time;
    setIsModified(isModified);
  }, [mealList, mealName, mealTime, originalMealList, meal?.name, meal?.time]);

  const toggleType = (type: "Lista" | "Alimentos") => {
    setType(type);
  };

  const handleMealChange = (e) => {
    const value = e.target.value;
    setMealName(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      name: value.trim() === "" ? "O nome não pode estar vazio." : "",
    }));
  };

  const handleTimeBlur = () => {
    let formattedTime = mealTime;

    if (/^\d{4}$/.test(formattedTime)) {
      formattedTime = `${formattedTime.slice(0, 2)}:${formattedTime.slice(2)}`;
    }

    let [hours, minutes] = formattedTime.split(":");

    if (!hours || isNaN(Number(hours))) hours = "00";
    if (!minutes || isNaN(Number(minutes))) minutes = "00";

    hours = hours.padStart(2, "0");
    minutes = minutes.padStart(2, "0");

    if (Number(hours) > 24) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        time: "Horas não podem ser maiores que 24.",
      }));
      return;
    }

    if (Number(minutes) > 59) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        time: "Minutos não podem ser maiores que 59.",
      }));
      return;
    }

    setMealTime(`${hours}:${minutes}`);
    setErrors((prevErrors) => ({ ...prevErrors, time: "" }));
  };

  const handleTimeChange = (e) => {
    const value = e.target.value;
    if (/^[0-9:]*$/.test(value)) {
      setMealTime(value);
    }
  };

  const handleAddVariation = (e) => {
    e.stopPropagation();
    newVariation();
  };

  const newVariation = () => {
    const mealId = uuidv4();
    setMealList([
      ...mealList,
      { id: mealId, name: "Nova Variação", kcal: 0, mealListItems: [] },
    ]);

    handleAddFood(mealId);
  };

  const handleDuplicateVariation = (id) => {
    const variationToDuplicate = mealList.find((meal) => meal?.id === id);
    if (!variationToDuplicate) {
      console.error("Variação não encontrada");
      return;
    }
    const newVar = {
      ...variationToDuplicate,
      id: uuidv4(),
      name: `${variationToDuplicate.name} - (Cópia)`,
    };

    setMealList((prevMealList) => [...prevMealList, newVar]);
  };

  const handleDeleteVariation = (id) => {
    const length = mealList?.length;
    if (selectedVariation + 1 === length && length > 1) {
      setSelectedVariation(length - 2);
    }
    setMealList((prevMealList) =>
      prevMealList.filter((meal) => meal?.id !== id)
    );
  };

  const handleNameChange = (variationId, newName) => {
    setMealList((prevMealList) =>
      prevMealList.map((variation) =>
        variation.id === variationId
          ? { ...variation, name: newName }
          : variation
      )
    );
  };

  const deleteFoodFromMeal = (mealId, foodId) => {
    setMealList((prevMealList) =>
      prevMealList.map((meal) =>
        meal?.id === mealId
          ? {
              ...meal,
              mealListItems: meal?.mealListItems.filter(
                (item) => item.id !== foodId
              ),
            }
          : meal
      )
    );
  };

  const handleAddFood = (mealItemId) => {
    setMealList((prevMealList) =>
      prevMealList.map((variation) =>
        variation.id === mealItemId
          ? {
              ...variation,
              mealListItems: [
                ...variation.mealListItems,
                {
                  id: uuidv4(),
                  food: {
                    value: "",
                    label: "",
                    unities: [{ value: "", label: "" }],
                  },
                  unity: { value: "", label: "" },
                  quantity: 0,
                },
              ],
            }
          : variation
      )
    );
  };
  const handleDuplicateFood = (mealId, foodId) => {
    // Encontre a refeição que contém o alimento a ser duplicado
    const mealToUpdate = mealList.find((meal) => meal.id === mealId);
    if (!mealToUpdate) {
      console.error("Refeição não encontrada");
      return;
    }

    // Encontre o alimento dentro da refeição
    const foodToDuplicate = mealToUpdate.mealListItems.find(
      (item) => item.id === foodId
    );
    if (!foodToDuplicate) {
      console.error("Alimento não encontrado");
      return;
    }

    // Criação da cópia do alimento
    const duplicatedFood = {
      ...foodToDuplicate,
      id: uuidv4(), // Novo id para o alimento duplicado
      food: { ...foodToDuplicate.food },
      unity: { ...foodToDuplicate.unity },
    };

    // Encontre o índice do alimento original
    const foodIndex = mealToUpdate.mealListItems.findIndex(
      (item) => item.id === foodId
    );

    // Crie uma nova lista de mealListItems, inserindo a cópia logo após o original
    const updatedMealListItems = [
      ...mealToUpdate.mealListItems.slice(0, foodIndex + 1), // Todos os itens até o original
      duplicatedFood, // O alimento duplicado
      ...mealToUpdate.mealListItems.slice(foodIndex + 1), // Todos os itens depois do original
    ];

    // Atualiza a refeição com o novo alimento duplicado na posição correta
    setMealList((prevMealList) =>
      prevMealList.map((meal) =>
        meal.id === mealId
          ? { ...meal, mealListItems: updatedMealListItems } // Atualiza a refeição com a nova lista
          : meal
      )
    );
  };

  useEffect(() => {
    if (createVariation) {
      newVariation();
    }
    if (createFood) {
      handleAddFood(mealList[currentIndex]?.id);
    }
  }, []);

  const handleSave = async () => {
    let error = false;

    const updatedMealList = mealList.map((list) => ({
      ...list,
      mealListItems: list.mealListItems.map((item) => {
        if (!item.food.id) {
          item.food.erro = true;
          error = true; // Marca que existe um erro
        }
        if (!item.unity.id) {
          item.unity.erro = true;
          error = true; // Marca que existe um erro
        }
        return item;
      }),
    }));

    setMealList(updatedMealList);
    if (error) {
      return;
    }
    if (!creating) {
      await updateMeal({
        mealId: meal?.id,
        mealName,
        mealTime,
        refs: updatedMealList,
      });
    } else {
      await createMeal({
        dietId,
        mealName,
        mealTime,
        refs: updatedMealList,
      });
    }
  };

  const selectVariation = (index) => {
    setType("Alimentos");
    setSelectedVariation(index);
  };

  const handleFoodChange = (variationId, foodId, data) => {
    setMealList((prevMealList) =>
      prevMealList.map((variation) =>
        variation.id === variationId
          ? {
              ...variation,
              mealListItems: variation.mealListItems.map((item) =>
                item.id === foodId
                  ? {
                      ...item,
                      foodId: data.selectedFood.value,
                      unityId: data.selectedUnity.value,
                      quantity: data.quantity,
                      food: {
                        id: data.selectedFood.value,
                        name: data.selectedFood.label,
                        carb: item.food.carb,
                        protein: item.food.protein,
                        fat: item.food.fat,
                      },
                      unity: {
                        id: data.selectedUnity.value,
                        foodId: data.selectedFood.value,
                        un: data.selectedUnity.label,
                        unitMultiplier: item.unity.unitMultiplier,
                      },
                    }
                  : item
              ),
            }
          : variation
      )
    );
  };

  return (
    <Menus>
      <div id="editref" className="relative flex flex-col h-full">
        <div className="font-bold text-xl text-center">
          {creating ? "Criar Refeição" : "Editar Refeição"}
        </div>
        <div className="text-base mb-3 text-grey50 text-center">
          Dieta - {diet?.name}
        </div>
        <Toogle
          options={["Lista", "Alimentos"]}
          value={type}
          onChange={toggleType}
          className="mb-7"
        />

        <div className="flex gap-2 mb-3">
          <div className="relative w-full">
            <label
              className={`absolute top-[-6px] text-grey50 px-1 ml-1 text-sm bg-white line leading-3 ${
                errors.name ? "!text-darkred !bg-half-lightred-transparent" : ""
              }`}
            >
              Nome da Refeição
            </label>
            <input
              value={mealName}
              onChange={handleMealChange}
              // onBlur={handleNameBlur}
              className={`p-2 w-full border-1 rounded-lg ${
                errors.name
                  ? "border-darkred bg-lightred text-darkred"
                  : "border-grey-50"
              }`}
            />
          </div>
          <div className="relative">
            <label
              className={`absolute top-[-6px] text-grey50 px-1 ml-1 text-sm bg-white line leading-3 ${
                errors.time ? "!text-darkred !bg-half-lightred-transparent" : ""
              }`}
            >
              Horário
            </label>
            <input
              value={mealTime}
              onChange={handleTimeChange}
              onBlur={handleTimeBlur}
              className={`font-medium p-2 w-16 border-1 text-darkgreen text-center rounded-lg ${
                errors.time
                  ? "border-darkred bg-lightred text-darkred"
                  : "border-grey-50"
              }`}
            />
          </div>
        </div>

        {type === "Lista" ? (
          <EditRefList
            mealsList={mealList}
            onSelectVariation={selectVariation}
            onDeleteVariation={handleDeleteVariation}
            onAddVariation={handleAddVariation}
            onDuplicateVariation={handleDuplicateVariation}
          />
        ) : (
          <EditRefFoods
            mealsList={mealList}
            onDeleteVariation={handleDeleteVariation}
            currentIndex={selectedVariation}
            setIndex={setSelectedVariation}
            onFoodChange={handleFoodChange}
            onNameChange={handleNameChange}
            handleAddVariation={handleAddVariation}
            handleAddFood={handleAddFood}
            deleteFoodFromMeal={deleteFoodFromMeal}
            handleDuplicateFood={handleDuplicateFood}
          />
        )}

        <div className="flex gap-4 px-1">
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
          <Button
            size="small"
            onClick={handleSave}
            disabled={!isModified || disabled}
          >
            Salvar
          </Button>
        </div>
        {isLoading && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center bg-white w-full h-full bg-opacity-80">
            <Spinner />
          </div>
        )}
      </div>
    </Menus>
  );
}
