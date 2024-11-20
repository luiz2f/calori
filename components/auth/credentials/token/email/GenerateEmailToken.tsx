"use client";

import { generateTokenAndSendEmailVerification } from "@/actions/token";
import AuthButton from "@/components/auth/AuthButton";
import { useRouter } from "next/router";
import { useState } from "react";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export default function GeneratetEmailToken() {
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);

    const { email } = Object.fromEntries(formData) as Record<string, string>;

    if (!email || !emailRegex.test(email as string)) {
      setError("Please enter a valid email.");
      return;
    }

    let errorMessage: string = "";

    generateTokenAndSendEmailVerification(email)
      .then((data) => {
        if ("success" in data) {
          setSuccess(data.success);
        }
        if ("error" in data) {
          errorMessage = data.error;
        }
      })
      .catch((error) => {
        console.error(error);
        errorMessage = "An unexpected error occurred 😢";
      });

    if (errorMessage === "User not found") {
      setError("No user was found with that email address");
    } else {
      setError(errorMessage);
    }
    if (success) {
      return router?.push("/token-sent");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
      <div>
        <label>Email</label>
        <input
          type="email"
          id="email"
          placeholder="Email"
          name="email"
          className={`mt-1 w-full px-4 p-2 h-10 rounded-md border ${
            error ? "border-red-500" : "border-gray-200"
          } bg-white text-sm text-gray-700`}
        />
        {error && <span className="text-red-500">{error}</span>}
      </div>
      {success && <p>Recovery password email was sent</p>}

      <AuthButton actionText="Recover password" />
    </form>
  );
}
