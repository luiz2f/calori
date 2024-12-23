"use client";
import { changePasswordByToken } from "@/actions/token";
import AuthButton from "@/components/auth/AuthButton";
import SuccessPage from "@/components/by-page/auth/SucessPage";
import NavAnchor from "@/components/ui/NavAnchor";
import NavButton from "@/components/ui/NavButton";
import PasswordInput from "@/components/ui/PasswordInput";
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
      setError("As senhas não coincidem");
      return; // Retorna sem fazer o login
    }

    if (!password || password?.length < 8) {
      setError("A senha deve ter no mínimo 8 caracteres.");
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
      setError("Um erro inesperado ocorreu 😢");
    }
  };
  return (
    <>
      {!success ? (
        <div className="flex flex-col h-full justify-between pt-6 pb-2">
          <div className="flex flex-col w-full ">
            <h1 className="text-2xl w-full text-center font-bold mb-2">
              Redefinir Senha
            </h1>
            <h4 className="text-xl text-darkgreen w-full text-center  mb-6">
              Insira sua nova senha para continuar
            </h4>

            <form
              onSubmit={handleSubmit}
              className="w-full flex flex-col gap-2 "
            >
              <PasswordInput
                id="password"
                placeholder="Senha"
                newPassword={true}
                error={error}
              />
              <PasswordInput
                id="confirmPassword"
                placeholder="Confirmar senha"
                error={error}
                errorText={true}
                newPassword={true}
              />
              <AuthButton actionText="Alterar senha" className="mt-2" />
            </form>
          </div>
          <NavAnchor href="/login">Entrar com sua conta</NavAnchor>
        </div>
      ) : (
        <SuccessPage
          title="Senha alterada com sucesso!"
          subtitle="Sua nova senha está pronta para uso"
        >
          <NavButton href="/login">Fazer Login</NavButton>
        </SuccessPage>
      )}
    </>
  );
}
