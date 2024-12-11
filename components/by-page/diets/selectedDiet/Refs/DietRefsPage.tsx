import AddRef from "./AddRef";
import DietRef from "./DietRef";

export default function DietRefsPage() {
  return (
    <>
      <div className="flex flex-col w-full p-4 gap-12 mt-6 ">
        <DietRef />
        <DietRef />
        <DietRef />
        <DietRef />
        <AddRef />
      </div>
      <div className="text-center mt-4 mb-4 underline-offset-2 underline text-darkred">
        Apagar Dieta
      </div>
    </>
  );
}
