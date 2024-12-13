import Menus from "@/components/ui/Menu";
import AddRef from "./AddRef";
import DietRef from "./DietRef";
import Modal from "@/components/ui/Modal";

export default function DietRefsPage() {
  return (
    <Modal>
      <Menus>
        <div className="flex flex-col w-full p-4 gap-12 mt-6 ">
          <DietRef />
          <AddRef />
        </div>
      </Menus>
      <div className="text-center mt-4 mb-4 underline-offset-2 underline text-darkred">
        Apagar Dieta
      </div>
    </Modal>
  );
}
