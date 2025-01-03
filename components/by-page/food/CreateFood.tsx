import { useContext, useState } from "react";
import Button from "@/components/ui/Button";
import { useCreateFood } from "@/app/data/foods/useCreateFood";
import { ModalContext } from "@/components/ui/Modal";
import Spinner from "@/components/ui/Spinner";

export default function CreateFood() {
  const { close } = useContext(ModalContext);
  const { isCreating, createFood, isSuccess } = useCreateFood();
  const created = !isCreating && isSuccess;
  const [inputs, setInputs] = useState({
    name: "Peito de Frango Cru",
    quantity: 100,
    unity: "gr",
    carb: 0,
    prot: 21.1,
    fat: 2.29,
  });

  const kcal = Math.round((inputs.carb + inputs.prot) * 4 + inputs.fat * 9);
  const [errors, setErrors] = useState({
    name: false,
    quantity: false,
    unity: false,
    carb: false,
    prot: false,
    fat: false,
  });
  const disabled = Object.values(errors).some((error) => error);

  const handleChange = (e) => {
    const { id, value } = e.target;
    const newValue = parseFloat(value);
    console.log(value);
    console.log(newValue);
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
      createFood(inputs);
    }
  };

  return (
    <>
      <form className="relative" onSubmit={handleSubmit}>
        <div className="font-bold text-xl mb-10 text-center">
          {created ? "Alimento Criado" : "Criar Alimento"}
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
              disabled={created}
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
              Quantity
            </label>
            <input
              disabled={created}
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
              Unity
            </label>
            <input
              disabled={created}
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
              disabled={created}
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
              disabled={created}
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
              disabled={created}
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
          {!created ? (
            <>
              <Button
                size="small"
                cw="lightred"
                onClick={() => close("create-food")}
              >
                Cancelar
              </Button>
              <Button size="small" type="submit" disabled={disabled}>
                Criar Alimento
              </Button>
            </>
          ) : (
            <Button
              size="small"
              cw="light"
              onClick={() => close("create-food")}
            >
              Fechar
            </Button>
          )}
        </div>
      </form>
      {isCreating && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center bg-white w-full h-full bg-opacity-80">
          <Spinner />
        </div>
      )}
    </>
  );
}
