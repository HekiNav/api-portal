"use server"
import { service, session, user } from "@/db/schema"
import { createDB } from "./db"
import { desc, eq, or } from "drizzle-orm"
import { Service, User } from "./definitions"

// public data functions for users and services
export async function getUser(identifier: string): Promise<User | null> {
    const db = await createDB()
    const data = await db.query.user.findFirst({
        where: or(eq(user.id, identifier), eq(user.name, identifier)),
        with: { sessions: { limit: 1, orderBy: desc(session.expiresAt) } }
    })
    if (!data) return null
    return {...data, lastSeen: data.sessions[0].expiresAt, email: "N/A", sessions: undefined}
}

export async function getService(id: string): Promise<Service | null> {
    const db = await createDB()
    const data = await db.query.service.findFirst({
        where: eq(service.id, id),
        with: {createdBy: true}
    })
    if (!data) return null
    return {...data, createdBy: {...data.createdBy, email: "N/A"}}
}

export async function getServices(): Promise<Service[] | null> {
    const db = await createDB()
    const data = await db.query.service.findMany({
        where: eq(service.visibility, 2),
        with: { createdBy: true }
    })
    if (!data) return null
    return data.map(s => ({...s, createdBy: {...s.createdBy, email: "N/A"}}))
}