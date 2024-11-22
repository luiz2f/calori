import { auth } from "@/auth";
import ChangePasswordForm from "@/components/auth/credentials/ChangePasswordForm";
import { redirect } from "next/navigation";

export default async function ChangePassword() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const userEmail = session.user.email;
  if (userEmail) {
    return <ChangePasswordForm userEmail={userEmail} />;
  }
}
