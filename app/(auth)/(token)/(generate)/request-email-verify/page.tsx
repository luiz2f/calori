import { getUserByEmail } from "@/actions/auth";
import { auth } from "@/auth";
import GeneratetEmailToken from "@/components/auth/credentials/token/email/GenerateEmailToken";

export default async function RequestEmailVerify() {
  const session = await auth();
  let user;
  if (session?.user?.email) {
    const userEmail = session.user.email;
    const result = await getUserByEmail(userEmail);
    if (result && !("error" in result)) {
      user = result;
    }
  }
  const isVerified = !!user?.emailVerified;
  return (
    <div>
      {isVerified ? <p>User already verified 😉</p> : <GeneratetEmailToken />}
    </div>
  );
}
