"use client";

import { generateTokenAndSendEmailVerification } from "@/actions/token";
import AuthButton from "@/components/auth/AuthButton";
import Input from "@/components/ui/Input";
import NavAnchor from "@/components/ui/NavAnchor";
import { useRouter } from "next/compat/router";
import { useState } from "react";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export default function GeneratetEmailToken() {
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const router = useRouter();

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
      const data = await generateTokenAndSendEmailVerification(email);
      if ("success" in data) {
        setSuccess(data.success);
      }
      if ("error" in data) {
        errorMessage = data.error;
      }
    } catch (error) {
      console.error(error);
      errorMessage = "Um erro inesperado ocorreu 😢";
    }

    if (errorMessage === "User not found") {
      setError("No user was found with that email address");
    } else {
      setError(errorMessage);
    }
    if (success) {
      return router?.push("/token-sent");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col pt-6">
      <div className="flex flex-col w-full ">
        <h1 className="text-2xl w-full text-center font-bold mb-2">
          Verificar Email
        </h1>
        <h4 className="text-xl text-darkgreen w-full text-center  mb-6">
          Insira seu e-mail para enviar
          <br />o token de verificação
        </h4>
      </div>

      <Input
        id="email"
        placeholder="Email"
        autoComplete="username"
        type="email"
        error={error}
      />
      <AuthButton actionText="Recover password" className="mt-4" />

      <NavAnchor href="/login">Entrar com sua conta</NavAnchor>
    </form>
  );
}
