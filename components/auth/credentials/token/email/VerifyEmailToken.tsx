"use client";
import { verifyEmailToken } from "@/actions/token";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { BiCheck, BiError } from "react-icons/bi";

export default function VerifyEmailToken() {
  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const onSubmit = useCallback(async () => {
    if (success || error) {
      return;
    }

    if (!token) {
      setError("No token provided");
      return;
    }

    // TODO📌
    try {
      const data = await verifyEmailToken(token);

      if ("success" in data) {
        setSuccess(data.success);
      } else if ("error" in data) {
        setError(data.error);
      }
    } catch (error) {
      console.error(error);
      setError("An unexpected error occurred");
    }
  }, [token, success, error]);

  useEffect(() => {
    onSubmit();
  }, []);

  return (
    <div className="rounded-lg border bg-card text-card-foreground  shadow-md w-full">
      <div className="flex flex-col space-y-1.5 p-6">
        <div className="w-full flex flex-col gap-y-4 items-center justify-center">
          <h1 className="text-3xl font-semibold">Confirming now...</h1>
          <p className="text-muted-foreground text-sm">
            Confirming your email address
          </p>
        </div>
      </div>
      <div className="p-6 pt-0">
        <div className="flex items-center w-full justify-center">
          {!success && !error && <p>Loading</p>}
          <div className="flex space-x-4 items-center p-2 rounded-lg text-emerald-500 bg-emerald-500/30">
            <BiCheck className="w-4 h-4 " />
            <p>{success}</p>
            <Link href={`/login`}>Fazer Login</Link>
          </div>
          {!success && (
            <div className="flex space-x-4 items-center p-2 rounded-lg text-emerald-500 bg-emerald-500/30">
              <BiError className="w-4 h-4 " />
              {error === "Invalid token" || error === "Token has expired" ? (
                <>
                  <p>{error}</p>
                  <button>Enviar novo email de verificação</button>
                  {/* TODO TODO TODO TODO TODO */}
                </>
              ) : (
                <p>{error}</p>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center p-6 pt-0">
        <button className="font-normal w-full">
          <Link href="/auth/login">Back to Login</Link>
        </button>
      </div>
    </div>
  );
}
