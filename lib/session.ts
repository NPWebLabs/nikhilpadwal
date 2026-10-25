import "server-only";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession } from "./auth";

export async function getAdmin() {
  const store = await cookies();
  return verifySession(store.get(SESSION_COOKIE)?.value);
}

export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) throw new Error("Unauthorized");
  return admin;
}
