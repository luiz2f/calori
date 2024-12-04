"use client";
import { changePasswordByEmail } from "@/actions/auth";
import AuthButton from "@/components/auth/AuthButton";
import { useState } from "react";

interface ResetPasswordFormProps {
  userEmail: string;
}

// FORM A SER EXIBIDO CASO O TOKEN DO RESETPASSWORD SEJA VALIDO
export default function ChangePasswordForm({
  userEmail,
}: ResetPasswordFormProps) {
  const [success, setSuccess] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const { newPassword, confirmNewPassword } = Object.fromEntries(
      formData
    ) as Record<string, string>;
    if (newPassword !== confirmNewPassword) {
      setError("As senhas não coincidem");
      return; // Retorna sem fazer o login
    }

    if (!newPassword || newPassword?.length < 8) {
      setError("A senha deve ter no mínimo 8 caracteres.");
      return; // Retorna sem fazer o login
    }

    try {
      const data = await changePasswordByEmail(userEmail, formData);
      if ("success" in data) {
        setSuccess(data.success);
      }
      if ("error" in data) {
        setError(data.error);
      }
    } catch (error) {
      console.error(error);
      setError("Um erro inesperado ocorreu 😢");
    }
  };
  return (
    <div>
      {!success ? (
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div>
            <label>Current password</label>
            <input
              type="password"
              autoComplete="current-password"
              id="currentPassword"
              name="currentPassword"
              placeholder="Current password"
              className={`mt-1 w-full px-4 p-2 h-10 rounded-md border ${
                error ? "border-red-500" : "border-gray-200"
              } bg-white text-sm text-gray-700`}
            />
          </div>
          <div>
            <label>New password</label>
            <input
              type="password"
              autoComplete="new-password"
              id="newPassword"
              name="newPassword"
              placeholder="New password"
              className={`mt-1 w-full px-4 p-2 h-10 rounded-md border ${
                error ? "border-red-500" : "border-gray-200"
              } bg-white text-sm text-gray-700`}
            />
          </div>
          <div>
            <label>Confirm new password</label>
            <input
              type="password"
              autoComplete="new-password"
              id="confirmNewPassword"
              name="confirmNewPassword"
              placeholder="Confirm new password"
              className={`mt-1 w-full px-4 p-2 h-10 rounded-md border ${
                error ? "border-red-500" : "border-gray-200"
              } bg-white text-sm text-gray-700`}
            />
            {error && <span className="text-darkred">{error}</span>}
          </div>
          <AuthButton actionText="Alterar senha" />
        </form>
      ) : (
        <>
          <p>Senha alterada com sucesso!</p>
        </>
      )}
    </div>
  );
}
