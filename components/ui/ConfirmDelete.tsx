import { useEffect } from "react";
import Button from "./Button";
import Spinner from "./Spinner";

type ConfirmDeleteProps = {
  loading: boolean;
  loaded: boolean | undefined;
  resource: string;
  resourceName: string;
  modalName: string;
  onConfirm: () => void;
  onCloseModal?: () => void;
  disabled: boolean;
};

function ConfirmDelete({
  loading,
  loaded,
  resource,
  resourceName,
  onConfirm,
  disabled,
  onCloseModal,
  modalName,
}: ConfirmDeleteProps) {
  async function handleConfirm(e) {
    e.stopPropagation();
    try {
      await onConfirm();
    } catch (error) {
      console.error(error);
    } finally {
      if (loaded === undefined) {
        // caso não seja passada a condição de loaded, o modal é fechado automaticamente no fim do Confirm
        onCloseModal(modalName);
      }
    }
  }
  if (loaded) {
    onCloseModal(modalName);
  }
  console.log(modalName, onCloseModal, modalName);
  return (
    <div className="w-full flex flex-col gap-3 relative">
      <div className="font-bold text-xl mb-6 text-center">
        Apagar {resource}
      </div>
      <p className="text-blacklight w-5/6- mb-6 text-center">
        Tem certeza que deseja apagar a {resource.toLocaleLowerCase()}
        <br />
        <strong>{resourceName}</strong>
      </p>

      <div className="flex justify-end gap-3">
        <Button
          cw="grey"
          size="small"
          disabled={disabled || loading}
          onClick={(e) => {
            e.stopPropagation();
            onCloseModal(modalName);
          }}
        >
          Cancelar
        </Button>
        <Button
          cw="red"
          size="small"
          disabled={disabled || loading}
          onClick={(e) => handleConfirm(e)}
        >
          Apagar
        </Button>
      </div>
      {loading && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center bg-white w-full h-full bg-opacity-30">
          <Spinner />
        </div>
      )}
    </div>
  );
}

export default ConfirmDelete;
