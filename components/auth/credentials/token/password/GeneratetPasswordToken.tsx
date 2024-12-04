"use client";

import { generateTokenAndSendPasswordResetEmail } from "@/actions/token";
import AuthButton from "@/components/auth/AuthButton";
import ErrorPage from "@/components/by-page/auth/ErrorPage";
import Input from "@/components/ui/Input";
import NavAnchor from "@/components/ui/NavAnchor";
import NavButton from "@/components/ui/NavButton";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export default function GeneratetPasswordToken() {
  const router = useRouter();

  const [accountNotVerified, setAccountNotVerified] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);

    const { email } = Object.fromEntries(formData) as Record<string, string>;

    if (!email || !emailRegex.test(email as string)) {
      setError("Por favor insira um e-mail válido.");
      return;
    }

    let errorMessage: string = "";
    try {
      const data = await generateTokenAndSendPasswordResetEmail(email);
      if ("success" in data) {
        setSuccess(data.success);
      } else if (data && "error" in data) {
        errorMessage = data.error;
      }
    } catch (error) {
      console.error(error);
      errorMessage = "Um erro inesperado ocorreu 😢";
    }

    if (errorMessage === "Verify your account first") {
      setAccountNotVerified(true);
      setError("Verifique sua conta primeiro");
    } else if (errorMessage === "User not found") {
      setError("Credenciais invalidas");
    } else {
      setError(errorMessage);
    }
  };

  useEffect(() => {
    if (success) {
      router?.push("/token-sent");
    }
  }, [success, router]);
  return (
    <>
      {!accountNotVerified ? (
        <form onSubmit={handleSubmit} className="w-full flex flex-col pt-6">
          <div className="flex flex-col w-full ">
            <h1 className="text-2xl w-full text-center font-bold mb-2">
              Esqueci a Senha
            </h1>
            <h4 className="text-xl text-darkgreen w-full text-center  mb-6">
              Insira seu e-mail para recuperar
              <br /> sua senha
            </h4>
          </div>

          <Input id="email" placeholder="Email" type="email" error={error} />
          <AuthButton
            actionText="Recuperar Senha"
            disableAction={accountNotVerified}
            className="mt-4"
          />
          <NavAnchor href="/login">Fazer Login</NavAnchor>
        </form>
      ) : (
        <ErrorPage
          title="Email Não Verificado"
          subtitle="Verifique seu e-mail para continuar"
        >
          <NavButton href="/request-email-verify">
            Ir Para Verificação
          </NavButton>
        </ErrorPage>
      )}
    </>
  );
}
