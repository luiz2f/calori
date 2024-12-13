import RefSlider from "../RefSlider";
import EditFoodRow from "./editFood/EditFoodRow";

const foods = [
  { name: "Leite Integral", quant: 400, unit: "ml" },
  { name: "Farinha de Aveia", quant: 40, unit: "g" },
  { name: "Banana Prata", quant: 2, unit: "un" },
];

export default function EditRefFoods() {
  return (
    <div>
      <div className="flex gap-2 my-1 mt-7">
        <div className=" relative w-full">
          <label className="absolute top-[-6px] text-grey50 px-1 ml-1 text-sm bg-white line leading-3">
            Nome da Variação
          </label>
          <input
            value="Leite com Banana"
            className=" p-2 w-full border-1 border-grey-50 text-darkgreen rounded-lg"
          />
        </div>

        <div className="grid pl-1 grid-cols-frq gap-3 text-center text-darkgreen ">
          <div className="flex flex-col justify-end align-bottom relative">
            <div className="grayscale contrast-150 text-xs opacity-50">🍞</div>
            <div>48</div>
            <div className="absolute top-[-18px] left-0 right-0 text-xs text-grey50">
              +13
            </div>
          </div>
          <div className="flex flex-col justify-end align-bottom relative">
            <div className="grayscale contrast-150 text-xs opacity-50">🥩</div>
            <div>28</div>
            <div className="absolute top-[-18px] left-0 right-0 text-xs text-grey50">
              +8
            </div>
          </div>
          <div className="flex flex-col justify-end align-bottom relative">
            <div className="grayscale contrast-150 text-xs opacity-50">🥑</div>
            <div>7</div>
            <div className="absolute top-[-18px] left-0 right-0 text-xs text-grey50">
              +1
            </div>
          </div>
          <div className="flex flex-col justify-end align-bottom relative">
            <div className="text-xs text-grey50">kcal</div>
            <div>315</div>
            <div className="absolute top-[-18px] left-0 right-0 text-xs text-grey50">
              +13
            </div>
          </div>
        </div>
      </div>
      <div className="border-1 border-darkred w-6  bg-red-400 ">
        <RefSlider />
      </div>
      <div className="grid grid-cols-edref gap-2 text-center text-sm text-grey30 mb-1">
        <div>Quant.</div>
        <div>Un.</div>
        <div>Alimento</div>
        <div></div>
      </div>

      <div className="grid grid-cols-edref gap-2 w-full border-y-1 border-lightgreen py-3 text-sm mb-2">
        {foods?.map((food, index) => {
          return <EditFoodRow key={index} food={food} />;
        })}
      </div>
      <div className="flex justify-between mb-7">
        <div className="text-sm pl-3">+ Adicionar alimento</div>
        <div className="text-sm pl-3 text-darkred underline">
          Apagar variação
        </div>
      </div>
    </div>
  );
}
