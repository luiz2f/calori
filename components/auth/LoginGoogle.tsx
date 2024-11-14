"use client";
import { login } from "@/actions/auth";
import { FaGoogle } from "react-icons/fa";

type LoginGoogleProps = {
  isLogin?: boolean;
};
export default function LoginGoogle({ isLogin = true }: LoginGoogleProps) {
  return (
    <div
      onClick={() => login("google")}
      className="w-full gap-4  hover:cursor-pointer mt-6 h-12 bg-black rounded-md p-4 flex justify-center items-center"
    >
      <FaGoogle className="text-white" />
      <p className="text-white">{isLogin ? "Login" : "Register"} with Google</p>
    </div>
  );
}
