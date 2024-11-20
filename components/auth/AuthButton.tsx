import { useFormStatus } from "react-dom";
interface AuthButtonProps {
  actionText: string;
  disableAction?: boolean;
}
export default function AuthButton({
  actionText,
  disableAction,
}: AuthButtonProps) {
  const { pending } = useFormStatus();

  const disabled = pending || disableAction;
  return (
    <button
      disabled={disabled}
      type="submit"
      className={`${
        disabled ? "bg-gray-600" : "bg-blue-600"
      } rounded-md w-full px-12 py-3 text-sm font-medium text-white`}
    >
      {pending ? "Loading..." : actionText}
    </button>
  );
}
