"use client";
import { changePasswordByToken } from "@/actions/token";
import AuthButton from "@/components/auth/AuthButton";
import Link from "next/link";
import { useState } from "react";

interface ResetPasswordFormProps {
  token: string;
}

// FORM A SER EXIBIDO CASO O TOKEN DO RESETPASSWORD SEJA VALIDO
export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [success, setSuccess] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const { password, confirmPassword } = Object.fromEntries(
      formData
    ) as Record<string, string>;
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return; // Retorna sem fazer o login
    }

    if (!password || password?.length < 8) {
      setError("Password must be at least 8 characters long.");
      return; // Retorna sem fazer o login
    }
    try {
      const data = await changePasswordByToken(token, formData);
      if ("success" in data) {
        setSuccess(data.success);
      }
      if ("error" in data) {
        setError(data.error);
      }
    } catch (error) {
      console.error(error);
      setError("An unexpected error occurred");
    }
  };
  return (
    <div>
      {!success ? (
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div>
            <label>Password</label>
            <input
              type="password"
              autoComplete="current-password"
              id="password"
              name="password"
              placeholder="Password"
              className={`mt-1 w-full px-4 p-2 h-10 rounded-md border ${
                error ? "border-red-500" : "border-gray-200"
              } bg-white text-sm text-gray-700`}
            />
          </div>
          <div>
            <label>Confirm Password</label>
            <input
              type="password"
              autoComplete="current-password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm password"
              className={`mt-1 w-full px-4 p-2 h-10 rounded-md border ${
                error ? "border-red-500" : "border-gray-200"
              } bg-white text-sm text-gray-700`}
            />
            {error && <span className="text-red-500">{error}</span>}
          </div>
          <AuthButton actionText="Alterar senha" />
        </form>
      ) : (
        <>
          <p>Senha alterada com sucesso!</p>
          <Link href={`/login`}>Fazer Login</Link>
        </>
      )}
    </div>
  );
}
