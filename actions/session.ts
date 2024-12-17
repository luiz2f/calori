import { auth } from "@/auth";

export async function getSessionId() {
  const session = await auth();

  if (!session.userId) {
    return null;
  }

  return session?.userId;
}
