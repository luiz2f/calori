"use client";
import { verifyResetPasswordToken } from "@/actions/token";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { BiCheck, BiError } from "react-icons/bi";
import ResetPasswordForm from "./ResetPasswordForm";

// PÁGINA (EM COMPONENTE) QUE VERIFICA O TOKEN PELA PRIMEIRA VEZ
export default function VerifyPasswordToken() {
  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const onSubmit = useCallback(() => {
    if (success || error) {
      return;
    }

    if (!token) {
      setError("No token provided");
      return;
    }

    verifyResetPasswordToken(token)
      .then((data) => {
        if ("success" in data) {
          setSuccess(data.success);
        }
        if ("error" in data) {
          setError(data.error);
        }
      })
      .catch((error) => {
        console.error(error);
        setError("An unexpected error occurred");
      });
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
        {/* // 🔒🔒🔒 */}
        <div className="flex items-center w-full justify-center">
          {!success && !error && <p>Loading</p>}

          {success && token && (
            <>
              <div className="flex space-x-4 items-center p-2 rounded-lg text-emerald-500 bg-emerald-500/30">
                <BiCheck className="w-4 h-4 " />
                <p>{success}</p>
              </div>

              <ResetPasswordForm token={token} />
            </>
          )}

          {!success && (
            <div className="flex space-x-4 items-center p-2 rounded-lg text-emerald-500 bg-emerald-500/30">
              <BiError className="w-4 h-4 " />
              {error === "Invalid token" || error === "Token has expired" ? (
                <>
                  <p>{error}</p>
                  <button>Recuperar a senha novamente</button>
                </>
              ) : error === "User not verified" ? (
                <>
                  <p>{error}</p>
                  <p>Verifique sua caixa de spam</p>
                  <button>Enviar email de verificação</button>
                </>
              ) : (
                <p>{error}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
