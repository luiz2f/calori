"use client";

import { signOut } from "next-auth/react"; // Import correto para signOut do next-auth
import Spinner from "@/components/ui/Spinner";
import { useEffect } from "react";
import { useRouter } from "next/navigation"; // API de navegação atualizada

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await signOut({ callbackUrl: "/" }); // Redireciona automaticamente após o logout
      } catch (error) {
        console.error("Erro ao realizar logout:", error);
        router.push("/"); // Garante redirecionamento mesmo se algo falhar
      }
    };

    handleLogout(); // Executa o logout assim que o componente é montado
  }, [router]);

  return <Spinner />;
}
