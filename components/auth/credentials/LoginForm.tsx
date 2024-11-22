"use client";

import { loginWithCredentials } from "@/actions/auth";
import AuthButton from "../AuthButton";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export default function LoginForm() {
  const router = useRouter();

  const [errors, setErrors] = useState<{
    email?: string | boolean;
    password?: string;
  }>({}); // Inicializando com objeto vazio
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const newErrors: { email?: string | boolean; password?: string } = {};
    const { email, password } = Object.fromEntries(formData) as Record<
      string,
      string
    >;
    if (!email || !emailRegex.test(email as string)) {
      newErrors.email = "Please enter a valid email.";
      return;
    }
    if (!password || password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long.";
      return;
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const data = await loginWithCredentials(formData);
      if (data && "error" in data) {
        const dataError = data.error.split(".")[0];
        if (dataError === "Token sent") {
          router?.push("/token-sent");
        } else {
          setErrors({
            email: true,
            password: dataError,
          });
        }
      }
    } catch (error) {
      console.error(error);
      setErrors({
        email: true,
        password: "An unexpected error occurred 😢",
      });
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
        <div>
          <label>Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            className={`mt-1 w-full px-4 p-2 h-10 rounded-md border ${
              errors.email ? "border-red-500" : "border-gray-200"
            } bg-white text-sm text-gray-700`}
          />
          {errors.email && <span className="text-red-500">{errors.email}</span>}
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            autoComplete="current-password"
            id="password"
            name="password"
            placeholder="Password"
            className={`mt-1 w-full px-4 p-2 h-10 rounded-md border ${
              errors.password ? "border-red-500" : "border-gray-200"
            } bg-white text-sm text-gray-700`}
          />
          {errors.password && (
            <span className="text-red-500">{errors.password}</span>
          )}
        </div>
        <AuthButton actionText="Login" />
      </form>
    </div>
  );
}
