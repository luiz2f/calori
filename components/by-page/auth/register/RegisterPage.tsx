import RegisterForm from "@/components/auth/credentials/RegisterForm";
import LoginGoogle from "@/components/auth/LoginGoogle";
import NavAnchor from "@/components/ui/NavAnchor";
import { Dispatch, SetStateAction } from "react";

export default function RegisterPage({
  setExistentUser,
}: {
  setExistentUser: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <>
      <div className="flex flex-col w-full ">
        <h1 className="text-2xl w-full text-center font-bold mb-2">
          Registrar
        </h1>
        <h4 className="text-xl text-darkgreen w-full text-center  mb-6">
          Vamos começar?
        </h4>
        <LoginGoogle isLogin={false} />
        <div className="text-grey50 text-center my-3 text-sm"> ou </div>
        <RegisterForm setExistentUser={setExistentUser} />
      </div>
      <NavAnchor href="/login">
        <p>Já possuo uma conta</p>
      </NavAnchor>
    </>
  );
}
