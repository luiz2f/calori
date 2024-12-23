import { auth } from "@/auth";
import LoginForm from "@/components/auth/credentials/LoginForm";
import LoginGoogle from "@/components/auth/LoginGoogle";
import NavAnchor from "@/components/ui/NavAnchor";
import { redirect } from "next/navigation";

export default async function SignIn() {
  const session = await auth();
  if (session?.user) {
    redirect("/");
  }

  return (
    <div className="w-full h-full flex pt-6 pb-3">
      <section className="flex flex-col w-full h-full justify-between ">
        <div className="flex flex-col w-full ">
          <h1 className="text-2xl w-full text-center font-bold mb-2">Login</h1>
          <h4 className="text-xl text-darkgreen w-full text-center  mb-6">
            Bem vindo de Volta!
          </h4>
          <LoginGoogle />
          <div className="text-grey50 text-center my-3 text-sm"> ou </div>
          <LoginForm />
          <NavAnchor href="/forgot-password">Esqueci a Senha</NavAnchor>
        </div>
        <NavAnchor href="/register">
          Não possui uma conta? Registrar agora
        </NavAnchor>
      </section>
    </div>
  );
}
