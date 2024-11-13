"use client";
import { login } from "@/actions/auth";
import { FaGoogle } from "react-icons/fa";

export default function LoginGoogle() {
  return (
    <div
      onClick={() => login("google")}
      className="w-full gap-4  hover:cursor-pointer mt-6 h-12 bg-black rounded-md p-4 flex justify-center items-center"
    >
      <FaGoogle className="text-white" />
      <p className="text-white">Login with Google</p>
    </div>
  );
}
