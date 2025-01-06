"use client";
import { useUpdateWeight } from "@/app/data/user/useSetWeight";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import Toogle from "@/components/ui/Toogle";
import React, { useEffect, useState } from "react";

export default function MyWeight({ userId, userWeight }) {
  const defaultWeight = userWeight;
  const defaultWeightlb = parseFloat((userWeight * 2.20462).toFixed(2));
  const [weight, setWeight] = useState(userWeight);
  const [unity, setUnity] = useState<"kg" | "lb">("kg");
  const [error, setError] = useState(false);
  const { isPending, updateWeight, isError } = useUpdateWeight();
  const isEqual = weight === defaultWeight || defaultWeightlb === weight;

  useEffect(() => {
    if (isError) {
      setError(true);
    }
  }, [isError]);

  function checkInput(input?: string) {
    let weightKg = input || parseFloat(weight);
    if (!weightKg) {
      setError(true);
    } else {
      setError(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    let weightKg = parseFloat(weight);
    if (!weightKg) {
      setError(true);
    }
    if (unity === "lb") {
      weightKg = parseFloat((weight * 2.20462).toFixed(2));
    }
    updateWeight(weightKg, userId);
  }

  const handleWeightChange = (e) => {
    const input = e.target.value.replace(/[^0-9.,]/g, "");

    if (/^[0-9.,]*$/.test(input)) {
      setWeight(input);
      checkInput(input);
    }
  };

  const toggleUnity = (type: "kg" | "lb") => {
    setUnity(type);
    if (type === "kg") {
      setWeight((prevWeight) => parseFloat((prevWeight / 2.20462).toFixed(2))); // Convert kg to lblb to kg
    } else {
      setWeight((prevWeight) => parseFloat((prevWeight * 2.20462).toFixed(2))); // Convert kg to lb
    }
  };
  const exceptThisSymbols = ["e", "E", "+", "-", "."];
  return (
    <>
      <form onSubmit={handleSubmit} className="relative">
        <div className="font-bold text-xl mb-8 text-center">Meu Peso</div>
        <Toogle
          options={["kg", "lb"]}
          value={unity}
          onChange={toggleUnity}
          className="mb-6"
        />
        <div className="relative w-fit mx-auto">
          <label className="absolute top-[-6px] hidden text-grey50 px-1 ml-1 text-sm bg-white line leading-3">
            Peso
          </label>
          <input
            name="dietName"
            type="number"
            value={weight}
            onChange={(e) => handleWeightChange(e)}
            onBlur={() => checkInput()}
            onKeyDown={(e) =>
              exceptThisSymbols.includes(e.key) && e.preventDefault()
            }
            className={`p-2 w-40 border-1  rounded-lg mb-3 text-[2.5rem] font-bold text-center ${
              error
                ? "bg-lightred border-darkred text-darkred"
                : "border-grey-50"
            }`}
          />
        </div>

        <div className="flex gap-4 px-1 mt-6">
          <Button size="small" type="submit" disabled={error || isEqual}>
            Atualizar Peso
          </Button>
        </div>
        {isPending && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center bg-white w-full h-full bg-opacity-80">
            <Spinner />
          </div>
        )}
      </form>
    </>
  );
}
