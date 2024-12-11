import RefTableTest from "./RefTable";

export default function DietRef() {
  // 📌🐪 ORGANIZAR SLIDE, COMO VAI OCORRER
  // 📌🐳 COMPONENTE TABELA + PADDING
  // 📌🐳 3 DOTS?2

  return (
    <div>
      <div className="border-grey10 border-1 rounded-lg flex flex-col w-full relative">
        <div className="flex items-baseline  gap-1 absolute top-[-16px] bg-white px-1 left-0 ">
          <div className="font-medium text-2xl">Café da Manhã</div>
          <div className=" text-darkgreen">(11:00)</div>
        </div>
        <RefTableTest />
        {/* 😀 */}
      </div>
    </div>
  );
}
