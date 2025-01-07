import { useCallback, useContext, useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { useCreateFood } from "@/app/data/foods/useCreateFood";
import { ModalContext } from "@/components/ui/Modal";
import Spinner from "@/components/ui/Spinner";
import { useUpdateFood } from "@/app/data/foods/useUpdateFood";

export default function CreateEditFood({
  shouldReturn = false,
  editing = false,
  foodInfo,
  modalName,
}) {
  const editInput = {
    name: foodInfo?.name,
    quantity: parseFloat((1 / foodInfo?.unities[0]?.unitMultiplier).toFixed(2)),
    unity: foodInfo?.unities[0]?.un,
    carb: foodInfo?.carb,
    prot: foodInfo?.protein,
    fat: foodInfo?.fat,
  };
  const defaultInputs = {
    name: "Peito de Frango Cru",
    quantity: 100,
    unity: "g",
    carb: 0,
    prot: 21.1,
    fat: 2.29,
  };
  const stateDefault = editing ? editInput : defaultInputs;
  const { close, unsavedChanges } = useContext(ModalContext);
  const {
    isCreating,
    createFood,
    isSuccess: isSuccessC,
  } = useCreateFood({
    shouldReturn,
  });
  const {
    isUpdating,
    updateFood,
    isSuccess: isSuccessU,
    reset,
  } = useUpdateFood();
  const [inputs, setInputs] = useState(stateDefault);
  const [originalInputs, setOriginalInputs] = useState(stateDefault);
  const [isModified, setIsModified] = useState(editing ? false : true);

  const isLoading = editing ? isUpdating : isCreating;
  const isSuccess = editing ? isSuccessU : isSuccessC;

  const kcal = Math.round((inputs.carb + inputs.prot) * 4 + inputs.fat * 9);
  const [errors, setErrors] = useState({
    name: false,
    quantity: false,
    unity: false,
    carb: false,
    prot: false,
    fat: false,
  });
  const disabled =
    Object.values(errors).some((error) => error) || isLoading || !isModified;

  const handleClose = useCallback(() => {
    close(modalName);
  }, [close, modalName]);

  useEffect(() => {
    if (editing) {
      if (isModified) {
        unsavedChanges(modalName);
      } else {
        unsavedChanges("");
      }
    }
  }, [unsavedChanges, modalName, isModified, editing]);

  useEffect(() => {
    if (editing) {
      if (JSON.stringify(inputs) !== JSON.stringify(originalInputs)) {
        setIsModified(true);
      } else if (isModified) {
        setIsModified(false);
      }
    }
  }, [editing, inputs, originalInputs]);

  useEffect(() => {
    if (!isLoading && isSuccess) {
      if (!editing) {
        handleClose();
      } else {
        setOriginalInputs(inputs);
        setIsModified(false);
        reset();
      }
    }
  }, [editing, isLoading, isSuccess, handleClose, inputs, reset]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    const isText = id === "unity" || id === "name";
    const newValue = isText || value === "" ? value : parseFloat(value);
    setInputs((prev) => ({ ...prev, [id]: newValue }));
    if (value === "") {
      setErrors((prev) => ({ ...prev, [id]: true }));
    } else if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: false }));
    }
  };
  const handleSubmit = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!disabled) {
      if (editing) {
        updateFood({
          inputs,
          foodId: foodInfo?.id,
          unityId: foodInfo?.unities[0]?.id,
        });
      } else {
        createFood(inputs);
      }
    }
  };

  return (
    <>
      <form className="relative" onSubmit={handleSubmit}>
        <div className="font-bold text-xl mb-10 text-center">
          {editing
            ? "Editar Alimento"
            : isSuccess
            ? "Alimento Criado"
            : "Criar Alimento"}
        </div>
        <div className="flex gap-2 mb-8">
          <div className="relative w-full">
            <label
              htmlFor="name"
              className={`absolute top-[-6px] text-grey50 px-1 ml-1 text-sm bg-white line leading-3 ${
                errors.name ? "!text-darkred !bg-half-lightred-transparent" : ""
              }`}
            >
              Food Name
            </label>
            <input
              disabled={isLoading}
              type="text"
              id="name"
              value={inputs.name}
              onChange={handleChange}
              className={`p-2 w-full border-1 rounded-lg ${
                errors.name
                  ? "border-darkred bg-lightred text-darkred"
                  : "border-grey-50"
              }`}
            />
          </div>
        </div>
        <div className="flex gap-4 mb-4">
          <div className="relative w-full">
            <label
              htmlFor="quantity"
              className={`absolute top-[-6px] text-grey50 px-1 left-1/2 -translate-x-1/2 text-sm bg-white line leading-3 ${
                errors.quantity
                  ? "!text-darkred !bg-half-lightred-transparent"
                  : ""
              }`}
            >
              Quantidade
            </label>
            <input
              disabled={isLoading}
              type="number"
              id="quantity"
              value={inputs.quantity}
              onChange={handleChange}
              className={`font-medium p-2 w-full border-1 text-darkgreen text-center rounded-lg ${
                errors.quantity
                  ? "border-darkred bg-lightred text-darkred"
                  : "border-grey-50"
              }`}
            />
          </div>
          <div className="relative w-full">
            <label
              htmlFor="unity"
              className={`absolute top-[-6px] text-grey50 px-1 left-1/2 -translate-x-1/2 text-sm bg-white line leading-3 ${
                errors.unity
                  ? "!text-darkred !bg-half-lightred-transparent"
                  : ""
              }`}
            >
              Unidade
            </label>
            <input
              disabled={isLoading}
              type="text"
              id="unity"
              value={inputs.unity}
              onChange={handleChange}
              className={`font-medium p-2 w-full border-1 text-darkgreen text-center rounded-lg ${
                errors.unity
                  ? "border-darkred bg-lightred text-darkred"
                  : "border-grey-50"
              }`}
            />
          </div>
        </div>
        <div className="flex gap-4 mb-4">
          <div className="relative w-full">
            <label
              htmlFor="carb"
              className={`absolute top-[-6px] text-grey50 px-1 left-1/2 -translate-x-1/2 text-sm bg-white line leading-3 ${
                errors.carb ? "!text-darkred !bg-half-lightred-transparent" : ""
              }`}
            >
              Carboidrato
            </label>
            <input
              disabled={isLoading}
              type="number"
              id="carb"
              value={inputs.carb}
              onChange={handleChange}
              className={`font-medium p-2 w-full border-1 text-darkgreen text-center rounded-lg ${
                errors.carb
                  ? "border-darkred bg-lightred text-darkred"
                  : "border-grey-50"
              }`}
            />
          </div>
          <div className="relative w-full">
            <label
              htmlFor="prot"
              className={`absolute top-[-6px] text-grey50 px-1 left-1/2 -translate-x-1/2 text-sm bg-white line leading-3 ${
                errors.prot ? "!text-darkred !bg-half-lightred-transparent" : ""
              }`}
            >
              Proteína
            </label>
            <input
              disabled={isLoading}
              type="number"
              id="prot"
              value={inputs.prot}
              onChange={handleChange}
              className={`font-medium p-2 w-full border-1 text-darkgreen text-center rounded-lg ${
                errors.prot
                  ? "border-darkred bg-lightred text-darkred"
                  : "border-grey-50"
              }`}
            />
          </div>
          <div className="relative w-full">
            <label
              htmlFor="fat"
              className={`absolute top-[-6px] text-grey50 px-1 left-1/2 -translate-x-1/2 text-sm bg-white line leading-3 ${
                errors.fat ? "!text-darkred !bg-half-lightred-transparent" : ""
              }`}
            >
              Gordura
            </label>
            <input
              disabled={isLoading}
              type="number"
              id="fat"
              value={inputs.fat}
              onChange={handleChange}
              className={`font-medium p-2 w-full border-1 text-darkgreen text-center rounded-lg ${
                errors.fat
                  ? "border-darkred bg-lightred text-darkred"
                  : "border-grey-50"
              }`}
            />
          </div>
        </div>
        <div className="mb-6">
          <strong>{kcal}</strong> kcal a cada{" "}
          <strong className="text-darkgreen">
            {inputs.quantity} {inputs.unity}
          </strong>
        </div>

        <div className="flex gap-4 px-1">
          {editing || !isSuccess ? (
            <>
              <Button size="small" cw="lightred" onClick={handleClose}>
                Cancelar
              </Button>
              <Button size="small" type="submit" disabled={disabled}>
                {editing ? "Salvar" : "Criar Alimento"}
              </Button>
            </>
          ) : (
            <Button size="small" cw="light" onClick={handleClose}>
              Fechar
            </Button>
          )}
        </div>
      </form>
      {isLoading && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center bg-white w-full h-full bg-opacity-80">
          <Spinner />
        </div>
      )}
    </>
  );
}
