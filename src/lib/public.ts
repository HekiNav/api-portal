"use server"
import { session, user } from "@/db/schema"
import { createDB } from "./db"
import { desc, eq, or } from "drizzle-orm"
import { User } from "./definitions"

// public data functions for users
export async function getUser(identifier: string): Promise<User | null> {
    const db = await createDB()
    const data = await db.query.user.findFirst({
        where: or(eq(user.id, identifier), eq(user.name, identifier)),
        with: { sessions: { limit: 1, orderBy: desc(session.expiresAt) } }
    })
    if (!data) return null
    return {...data, lastSeen: data.sessions[0].expiresAt, email: "N/A", sessions: undefined}
}