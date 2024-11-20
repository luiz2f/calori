import { auth } from "@/auth";
import ChangePasswordForm from "@/components/auth/credentials/ChangePasswordForm";
import { redirect } from "next/navigation";

export default async function ChangePassword() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const userID = session.user.id; // ID do usuário autenticado
  if (userID) {
    return <ChangePasswordForm userID={userID} />;
  } // Passa o userID para o formulário
}
