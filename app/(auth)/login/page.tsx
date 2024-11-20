import LoginForm from "@/components/auth/credentials/LoginForm";
import LoginGoogle from "@/components/auth/LoginGoogle";
import Link from "next/link";

export default function SignIn() {
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
