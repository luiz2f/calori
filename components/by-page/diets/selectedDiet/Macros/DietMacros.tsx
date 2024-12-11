import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

export default function DietMacros() {
  const buttonStyle =
    "flex gap-1 items-center text-sm text-blackmed w-fit content-end";
  const iconStyle = "w-5 h-5 text-blacklight";
  return (
    <div className="flex flex-col w-full p-4">
      <div className="flex w-full justify-between ">
        <div className="flex items-center w-20 ">
          <div className={buttonStyle}>
            <HiChevronLeft className={iconStyle} />
            <p>kcal</p>
          </div>
        </div>
        <div className="flex gap-2 items-center text-darkgreen">
          <p>g/Kg</p>
        </div>
        <div className="flex items-center w-20 justify-end">
          <div className={buttonStyle}>
            <p>% kcal</p>
            <HiChevronRight className={iconStyle} />
          </div>
        </div>
      </div>
      <div className="w-full  h-fit py-8">
        <div className="grid grid-cols-3 max-w-64 m-auto">
          <div className="flex flex-col align-middle text-center">
            <div className="text-2xl mb-1">🍞</div>
            <div>Carbo</div>
            <div className="text-2xl text-darkgreen">3,90</div>
          </div>
          <div className="flex flex-col align-middle text-center">
            <div className="text-2xl mb-1">🥩</div>
            <div>Proto</div>
            <div className="text-2xl text-darkgreen border-x-1 border-grey10">
              2,34
            </div>
          </div>
          <div className="flex flex-col align-middle text-center">
            <div className="text-2xl mb-1">🥑</div>
            <div>Gord</div>
            <div className="text-2xl text-darkgreen">0,60</div>
          </div>
        </div>
      </div>
      <div className="flex items-center ">
        <div className="flex w-full bg-grey10 h-[1px]"></div>

        <div className=" w-full flex justify-between flex-col text-center">
          <div className="leading-[8px]">Total</div>
          <div className="font-black text-4xl">2851</div>
          <div className="leading-[8px]">kcal</div>
        </div>
        <div className="flex w-full bg-grey10 h-[1px]"></div>
      </div>
    </div>
  );
}
