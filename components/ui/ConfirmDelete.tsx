import Button from "./Button";

type ConfirmDeleteProps = {
  resource: string;
  resourceName: string;
  onConfirm: () => void;
  onCloseModal?: () => void;
  disabled: boolean;
};

function ConfirmDelete({
  resource,
  resourceName,
  onConfirm,
  disabled,
  onCloseModal,
}: ConfirmDeleteProps) {
  return (
    <div className="w-full flex flex-col gap-3">
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
          disabled={disabled}
          onClick={onCloseModal}
        >
          Cancelar
        </Button>
        <Button cw="red" size="small" disabled={disabled} onClick={onConfirm}>
          Apagar
        </Button>
      </div>
    </div>
  );
}

export default ConfirmDelete;
