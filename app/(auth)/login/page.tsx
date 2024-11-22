import { auth } from "@/auth";
import LoginForm from "@/components/auth/credentials/LoginForm";
import LoginGoogle from "@/components/auth/LoginGoogle";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function SignIn() {
  const session = await auth();
  if (session?.user) {
    redirect("/");
  }

  return (
    <div className="w-full flex mt-20 justify-center">
      <section className="flex flex-col w-[400px]">
        <h1 className="text-3xl w-full text-center font-bold mb-6">Login</h1>
        <LoginGoogle />
        <LoginForm />
        <Link href="/register" className="text-center mt-2 underline">
          <p>Criar uma conta</p>
        </Link>
      </section>
    </div>
  );
}
