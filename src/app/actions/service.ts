"use server"
import { service } from "@/db/schema"
import { getCurrentUser, userAdmin } from "@/lib/auth"
import { createDB } from "@/lib/db"
import { Service } from "@/lib/definitions"
import { eq } from "drizzle-orm"

export async function getServices(): Promise<Service[] | null> {
    if (!await userAdmin()) return null
    const db = await createDB()
    return await db.query.service.findMany({
        with: {
            createdBy: true
        }
    })
}
export async function deleteService(serviceId: string) {
    if (!await userAdmin()) return {
        success: false,
        message: "Insufficient authority"
    }
    const db = await createDB()
    await db.delete(service).where(eq(service.id, serviceId))
    return {
        success: true,
        message: "Deleted service"
    }
}

export async function createService(serviceData: Omit<Service, "createdById" | "updateTime" | "creationTime"|"id">) {
    const user = await getCurrentUser()
    if (!user?.admin) return {
    success: false,
    message: "Insufficient authority"
}
const db = await createDB()
await db.insert(service).values({
    ...serviceData,
    createdById: user.id,
    updateTime: new Date(),
    creationTime: new Date(),
    id: crypto.randomUUID()
})
return {
    success: true,
    message: "Deleted service"
}
}