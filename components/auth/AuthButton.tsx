import { useFormStatus } from "react-dom";
import Button from "../ui/Button";

export default function AuthButton({
  actionText,
  disableAction,
  ...props
}: {
  actionText: string;
  disableAction?: boolean;
  [key: string]: any; // Para permitir propriedades adicionais
}) {
  const { pending } = useFormStatus();

  const disabled = pending || disableAction;
  return (
    <Button disabled={disabled} type="submit" cw="green" {...props}>
      {pending ? "Carregando..." : actionText}
    </Button>
  );
}
