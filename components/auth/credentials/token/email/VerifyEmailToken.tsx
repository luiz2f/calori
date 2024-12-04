"use client";
import { verifyEmailToken } from "@/actions/token";
import ErrorPage from "@/components/by-page/auth/ErrorPage";
import LoadingPage from "@/components/by-page/auth/LoadingPage";
import SuccessPage from "@/components/by-page/auth/SucessPage";
import NavButton from "@/components/ui/NavButton";
import Spinner from "@/components/ui/Spinner";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { BiCheck, BiError } from "react-icons/bi";
import { HiCheck, HiOutlineX } from "react-icons/hi";

export default function VerifyEmailToken() {
  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const onSubmit = useCallback(async () => {
    if (success || error) {
      return;
    }

    if (!token) {
      setError("Nenhum token fornecido");
      return;
    }

    try {
      const data = await verifyEmailToken(token);

      if ("success" in data) {
        setSuccess(data.success);
      } else if ("error" in data) {
        setError(data.error);
      }
    } catch (error) {
      console.error(error);
      setError("Um erro inesperado ocorreu 😢");
    }
  }, [token, success, error]);

  useEffect(() => {
    onSubmit();
  }, []);

  return (
    <>
      {!error && !success && (
        <LoadingPage
          title="Verificando token"
          subtitle="Só alguns segundos 😉"
        ></LoadingPage>
      )}
      {success && (
        <SuccessPage
          title="Token Verificado"
          subtitle="Seu e-mail foi verificado com sucesso!"
        >
          <NavButton href="/login">Fazer Login</NavButton>
        </SuccessPage>
      )}
      {error &&
        (error == "Invalid token" || error == "Token has expired" ? (
          <ErrorPage
            title="Token Invalido"
            subtitle="Gere um novo token de verificação"
          >
            <NavButton href="/verify-email">Gerar Novo Token</NavButton>
          </ErrorPage>
        ) : (
          <ErrorPage title="Erro" subtitle={error}>
            <NavButton href="/login">Voltar</NavButton>
          </ErrorPage>
        ))}
    </>
  );
}
