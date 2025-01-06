import { useContext } from "react";
import Button from "./Button";
import { ModalContext } from "./Modal";

function UnsavedChanges() {
  const { close, closeUnsaved } = useContext(ModalContext);

  return (
    <div className="w-full flex flex-col gap-3 relative">
      <div className="font-bold text-xl mb-6 text-center">
        Alterações pendentes
      </div>
      <p className="text-blacklight w-5/6- mb-6 text-center">
        Tem certeza que deseja fechar essa janela? <br /> Todas as alterações
        serão descartadas
      </p>

      <div className="flex justify-end gap-3 items-center">
        <Button cw="grey" size="small" onClick={() => close("unsavedChanges")}>
          Cancelar
        </Button>
        <Button cw="red" size="small" onClick={() => closeUnsaved()}>
          Descartar
        </Button>
      </div>
    </div>
  );
}

export default UnsavedChanges;
