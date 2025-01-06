"use client";
import { useEffect, useState } from "react";
import Toogle from "@/components/ui/Toogle";
import { useMacroContext } from "@/app/context/useMacroContext";
import { useWeight } from "@/app/data/user/useWeight";

export default function DietMacros() {
  const [currentMetric, setCurrentMetric] = useState<
    "g/KG" | "kcal" | "% kcal"
  >("kcal");
  const [data, setData] = useState({
    "g/KG": {
      carb: 0,
      prot: 0,
      fat: 0,
    },
    kcal: {
      carb: 0,
      prot: 0,
      fat: 0,
    },
    "% kcal": {
      carb: 0,
      prot: 0,
      fat: 0,
    },
    totalKcal: 0,
  });

  const { totalMacros } = useMacroContext();
  const { data: weight } = useWeight();

  useEffect(() => {
    const totalKcal =
      totalMacros.carb * 4 + totalMacros.prot * 4 + totalMacros.fat * 9;
    const newData = {
      "g/KG": {
        carb: (totalMacros.carb / weight).toFixed(1),
        prot: (totalMacros.prot / weight).toFixed(1),
        fat: (totalMacros.fat / weight).toFixed(1),
      },
      kcal: {
        carb: (totalMacros.carb * 4).toFixed(0),
        prot: (totalMacros.prot * 4).toFixed(0),
        fat: (totalMacros.fat * 9).toFixed(0),
      },
      "% kcal": {
        carb: !isNaN(((totalMacros.carb * 4) / totalKcal) * 100)
          ? `${(((totalMacros.carb * 4) / totalKcal) * 100).toFixed(0)}%`
          : "0%",
        prot: !isNaN(((totalMacros.prot * 4) / totalKcal) * 100)
          ? `${(((totalMacros.prot * 4) / totalKcal) * 100).toFixed(0)}%`
          : "0%",
        fat: !isNaN(((totalMacros.fat * 9) / totalKcal) * 100)
          ? `${(((totalMacros.fat * 9) / totalKcal) * 100).toFixed(0)}%`
          : "0%",
      },
      totalKcal: totalKcal,
    };

    setData(newData);
  }, [totalMacros, weight]); // Remove `newData` and include `totalMacros` and `weight`

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
            <div>Carboitrado</div>
            <div className="text-2xl text-darkgreen">
              {data[currentMetric].carb}
            </div>
          </div>
          <div className="flex flex-col align-middle text-center">
            <div className="text-2xl mb-1">🥩</div>
            <div>Proteína</div>
            <div className="text-2xl text-darkgreen border-x-1 border-grey10">
              {data[currentMetric].prot}
            </div>
          </div>
          <div className="flex flex-col align-middle text-center">
            <div className="text-2xl mb-1">🥑</div>
            <div>Gordura</div>
            <div className="text-2xl text-darkgreen">
              {data[currentMetric].fat}
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center ">
        <div className="flex w-full bg-grey10 h-[1px]"></div>

        <div className=" w-full flex justify-between flex-col text-center">
          <div className="leading-[8px]">Total</div>
          <div className="font-black text-4xl">{data.totalKcal}</div>
          <div className="leading-[8px]">kcal</div>
        </div>
        <div className="flex w-full bg-grey10 h-[1px]"></div>
      </div>
    </div>
  );
}
