"use client";
import { useState, useContext, useEffect, use } from "react";
import Button from "@/components/ui/Button";
import Menus from "@/components/ui/Menu";
import { ModalContext } from "@/components/ui/Modal";
import EditRefList from "./EditRefList";
import EditRefFoods from "./EditRefFoods";
import Toogle from "@/components/ui/Toogle";
import { useDiets } from "@/app/data/diets/useDiets";
import { v4 as uuidv4 } from "uuid";
import { useUpdateMeal } from "@/app/data/meals/useUpdateMeal";

export default function EditRef({ meal, currentIndex, goLeft, goRight }) {
  const { data: diets } = useDiets();
  const [type, setType] = useState<"Lista" | "Alimentos">("Lista");
  const [selectedVariation, setSelectedVariation] = useState(currentIndex);
  const { closeLast } = useContext(ModalContext);
  const [mealName, setMealName] = useState(meal.name);
  const [mealTime, setMealTime] = useState(meal.time);
  const [mealList, setMealList] = useState(meal.mealList || []);
  const [originalMealList, setOriginalMealList] = useState(meal.mealList || []);
  const [isModified, setIsModified] = useState(false);
  const [errors, setErrors] = useState({ name: "", time: "", food: false });
  const disabled = !!errors.name || !!errors.time;
  const diet = diets.filter((obj) => obj.id === meal.dietId)[0];
  const { isUpdating, updateMeal, isSuccess } = useUpdateMeal();

  useEffect(() => {
    if (meal.mealList) {
      setMealList(meal.mealList);
      setOriginalMealList(meal.mealList);
    }
  }, [meal.mealList]);

  useEffect(() => {
    const isModified =
      JSON.stringify(mealList) !== JSON.stringify(originalMealList) ||
      mealName !== meal.name ||
      mealTime !== meal.time;
    setIsModified(isModified);
  }, [mealList, mealName, mealTime, originalMealList, meal.name, meal.time]);

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
    const mealId = uuidv4();
    setMealList([
      ...mealList,
      { id: mealId, name: "Nova Variação", kcal: 0, mealListItems: [] },
    ]);
    handleAddFood(mealId);
  };

  const handleDuplicateVariation = (id) => {
    console.log(id);
    const variationToDuplicate = mealList.find((meal) => meal.id === id);
    console.log(variationToDuplicate);
    if (!variationToDuplicate) {
      console.error("Variação não encontrada");
      return;
    }
    const newVar = {
      ...variationToDuplicate,
      id: uuidv4(),
      name: `${variationToDuplicate.name} - (Cópia)`,
    };
    console.log(newVar);

    setMealList((prevMealList) => [...prevMealList, newVar]);
  };

  const handleDeleteVariation = (id) => {
    const length = mealList?.length;
    if (selectedVariation + 1 === length && length > 1) {
      console.log("🐣", length);
      setSelectedVariation(length - 2);
    }
    setMealList((prevMealList) =>
      prevMealList.filter((meal) => meal.id !== id)
    );
  };

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
    console.log(error);
    console.log(mealList);
    if (error) {
      return;
    }
    await updateMeal({
      mealId: meal?.id,
      mealName,
      mealTime,
      refs: updatedMealList,
    });
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

  const handleNameChange = (variationId, newName) => {
    console.log(variationId, newName);
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
        meal.id === mealId
          ? {
              ...meal,
              mealListItems: meal.mealListItems.filter(
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

  return (
    <Menus>
      <div>
        <div className="font-bold text-xl text-center">Editar Refeição</div>
        <div className="text-base mb-3 text-grey50 text-center">
          Dieta - {diet.name}
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
          />
        )}

        <div className="flex gap-4 px-1">
          <Button size="small" cw="lightred" onClick={() => closeLast()}>
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
      </div>
    </Menus>
  );
}
