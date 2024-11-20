import RegisterForm from "@/components/auth/credentials/RegisterForm";
import LoginGoogle from "@/components/auth/LoginGoogle";
import Link from "next/link";

export default function SignUp() {
  return (
    <div className="w-full flex mt-20 justify-center">
      <section className="flex flex-col w-[400px]">
        <h1 className="text-3xl w-full text-center font-bold mb-6">Register</h1>
        <LoginGoogle isLogin={false} />
        <RegisterForm />
        <Link href="/login" className="text-center mt-2 underline">
          <p>Já possuo uma conta</p>
        </Link>
      </section>
    </div>
  );
}
