"use client";

import { signOut } from "next-auth/react";
import Spinner from "@/components/ui/Spinner";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await signOut({ callbackUrl: "/" });
      } catch (error) {
        console.error("Erro ao realizar logout:", error);
        router.push("/");
      }
    };

    handleLogout();
  }, [router]);

  return <Spinner />;
}
