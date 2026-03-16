import { cookies } from "next/headers";
import { createDB } from "./db";
import { session, UserState } from "@/db/schema";
import { and, eq, gt } from "drizzle-orm";
import { User } from "./definitions";

export async function getCurrentUser({applications} = {applications: true}): Promise<User | null> {
  const db = await createDB()
  const sessionId = (await cookies()).get("session")?.value
  if (!sessionId) return null;

  const sessionData = await db.query.session.findFirst({
    where: and(eq(session.id, sessionId), gt(session.expiresAt, new Date())), with: { user: { with: {applications: (applications ? true : undefined)}} },
  })

  if (sessionData?.user.state == UserState.BANNED) return null

  return sessionData?.user ? {...sessionData.user, lastSeen: sessionData.expiresAt} : null
}
export async function userAdmin() {
  const user = await getCurrentUser()
  return user?.admin || false
}
