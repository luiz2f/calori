"use client";
import { useState } from "react";
import Toogle from "@/components/ui/Toogle";
import { useMacroContext } from "@/app/context/useMacroContext";

export default function DietMacros() {
  const { totalMacros } = useMacroContext();
  const weight = 78;
  const data = {
    "g/KG": {
      carbo: (totalMacros.carb / weight).toFixed(1),
      prot: (totalMacros.protein / weight).toFixed(1),
      gord: (totalMacros.fat / weight).toFixed(1),
    },
    kcal: {
      carbo: (totalMacros.carb * 4).toFixed(0),
      prot: (totalMacros.protein * 4).toFixed(0),
      gord: (totalMacros.fat * 9).toFixed(0),
    },
    "% kcal": {
      carbo: `${(
        ((totalMacros.carb * 4) /
          (totalMacros.carb * 4 +
            totalMacros.protein * 4 +
            totalMacros.fat * 9)) *
        100
      ).toFixed(0)}%`,
      prot: `${(
        ((totalMacros.protein * 4) /
          (totalMacros.carb * 4 +
            totalMacros.protein * 4 +
            totalMacros.fat * 9)) *
        100
      ).toFixed(0)}%`,
      gord: `${(
        ((totalMacros.fat * 9) /
          (totalMacros.carb * 4 +
            totalMacros.protein * 4 +
            totalMacros.fat * 9)) *
        100
      ).toFixed(0)}%`,
    },
  };
  const kcal = Math.round(
    (totalMacros.carb + totalMacros.protein) * 4 + totalMacros.fat * 9
  );

  const [currentMetric, setCurrentMetric] = useState<
    "g/KG" | "kcal" | "% kcal"
  >("kcal");

  const buttonStyle =
    "flex gap-1 items-center text-sm text-blackmed w-fit content-end";
  const iconStyle = "w-5 h-5 text-blacklight";

  return (
    <div className="flex flex-col w-full p-4">
      <div className="flex w-full justify-between ">
        <div className="flex items-center w-fit mx-auto ">
          <Toogle
            options={["g/KG", "kcal", "% kcal"]}
            value={currentMetric}
            onChange={setCurrentMetric}
            className="mt-2"
          />
        </div>
      </div>
      <div className="w-full h-fit py-8">
        <div className="grid grid-cols-3 max-w-64 m-auto">
          <div className="flex flex-col align-middle text-center">
            <div className="text-2xl mb-1">🍞</div>
            <div>Carbo</div>
            <div className="text-2xl text-darkgreen">
              {data[currentMetric].carbo}
            </div>
          </div>
          <div className="flex flex-col align-middle text-center">
            <div className="text-2xl mb-1">🥩</div>
            <div>Proto</div>
            <div className="text-2xl text-darkgreen border-x-1 border-grey10">
              {data[currentMetric].prot}
            </div>
          </div>
          <div className="flex flex-col align-middle text-center">
            <div className="text-2xl mb-1">🥑</div>
            <div>Gord</div>
            <div className="text-2xl text-darkgreen">
              {data[currentMetric].gord}
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center ">
        <div className="flex w-full bg-grey10 h-[1px]"></div>

        <div className=" w-full flex justify-between flex-col text-center">
          <div className="leading-[8px]">Total</div>
          <div className="font-black text-4xl">{kcal}</div>
          <div className="leading-[8px]">kcal</div>
        </div>
        <div className="flex w-full bg-grey10 h-[1px]"></div>
      </div>
    </div>
  );
}
