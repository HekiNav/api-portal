import { cookies } from "next/headers";
import { createDB } from "./db";
import { session } from "@/db/schema";
import { and, eq, gt } from "drizzle-orm";
import { User } from "./definitions";

export async function getCurrentUser(details = false): Promise<User | null> {
  const db = createDB()

  const sessionId = (await cookies()).get("session")?.value
  if (!sessionId) return null;

  const sessionData = await (await db).query.session.findFirst({
    where: and(eq(session.id, sessionId), gt(session.expiresAt, new Date())), with: { user: true }
  })

  return sessionData?.user || null
}