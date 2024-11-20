import RegisterForm from "@/components/auth/credentials/RegisterForm";
import LoginGoogle from "@/components/auth/LoginGoogle";
import Link from "next/link";
import { useState } from "react";

export default function SignUp() {
  const [existentUser, setExistentUser] = useState(false);

  return (
    <div className="w-full flex mt-20 justify-center">
      <section className="flex flex-col w-[400px]">
        <h1 className="text-3xl w-full text-center font-bold mb-6">Register</h1>
        <LoginGoogle isLogin={false} />
        {!existentUser ? (
          <>
            <RegisterForm setExistentUser={setExistentUser} />
            <Link href="/login" className="text-center mt-2 underline">
              <p>Já possuo uma conta</p>
            </Link>
          </>
        ) : (
          <>
            <h3> Usuário já existente </h3>
            <Link href="/login" className="text-center mt-2 underline">
              <p>Fazer Login</p>
            </Link>
            <Link
              href="/forgot-password"
              className="text-center mt-2 underline"
            >
              <p>Recuperar Senha</p>
            </Link>
          </>
        )}
      </section>
    </div>
  );
}
