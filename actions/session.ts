import { auth } from "@/auth";

export async function getSessionId() {
  const session = await auth();
  const userId = session?.userId;
  if (!userId) {
    throw new Error("Invalid Session");
  }
  return userId;
}
