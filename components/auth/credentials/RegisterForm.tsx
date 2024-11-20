"use client";

import { registerWithCredentials } from "@/actions/auth";
import AuthButton from "../AuthButton";
import { Dispatch, SetStateAction, useState } from "react";
import { useRouter } from "next/navigation";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

interface RegisterFormProps {
  setExistentUser: Dispatch<SetStateAction<boolean>>;
}

export default function RegisterForm({ setExistentUser }: RegisterFormProps) {
  const router = useRouter();
  const [errors, setErrors] = useState<{
    email?: string | boolean;
    password?: string | boolean;
    confirmPassword?: string;
  }>({});

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);

    let newErrors: {
      email?: string | boolean;
      password?: string | boolean;
      confirmPassword?: string;
    } = {};
    let errorMessage: string = "";

    const { email, password, confirmPassword } = Object.fromEntries(
      formData
    ) as Record<string, string>;

    if (!email || !emailRegex.test(email as string)) {
      newErrors.email = "Please enter a valid email.";
    }
    if (password !== confirmPassword) {
      newErrors.password = true;
      newErrors.confirmPassword = "Passwords do not match.";
    } else if (!password || password.length < 8) {
      newErrors.password = true;
      newErrors.confirmPassword =
        "Password must be at least 8 characters long.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; // Retorna sem fazer o login
    }

    registerWithCredentials(formData)
      .then((data) => {
        if (data) {
          if ("error" in data) {
            errorMessage = data.error.split(".")[0];
          }
        }
      })
      .catch((error) => {
        console.error(error);
        errorMessage = "An unexpected error occurred";
      });

    if (errorMessage === "Token sent") {
      return router?.push("/token-sent");
    } else if (errorMessage === "User already exists") {
      setExistentUser(true);
    } else {
      newErrors = {
        email: true,
        password: true,
        confirmPassword: errorMessage,
      };
      setErrors(newErrors);
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
            placeholder="Email"
            name="email"
            className={`mt-1 w-full px-4 p-2 h-10 rounded-md border ${
              errors.email ? "border-red-500" : "border-gray-200"
            } bg-white text-sm text-gray-700`}
          />
          {errors.email && <span className="text-red-500">{errors.email}</span>}
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            autoComplete="new-password"
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

        <div>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            autoComplete="new-password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm Password"
            className={`mt-1 w-full px-4 p-2 h-10 rounded-md border ${
              errors.confirmPassword ? "border-red-500" : "border-gray-200"
            } bg-white text-sm text-gray-700`}
          />
          {errors.confirmPassword && (
            <span className="text-red-500">{errors.confirmPassword}</span>
          )}
        </div>

        <AuthButton actionText="Sign Up" />
      </form>
    </div>
  );
}
