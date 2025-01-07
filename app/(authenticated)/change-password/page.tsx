import { auth } from "@/auth";
import ChangePasswordForm from "@/components/auth/credentials/ChangePasswordForm";
import Header from "@/components/Header";

export default async function ChangePassword() {
  const session = await auth();

  const userEmail = session.user.email;
  if (userEmail) {
    return (
      <>
        <Header home={true} />
        <ChangePasswordForm userEmail={userEmail} />
      </>
    );
  }
}
