"use server"
import { application } from "@/db/schema"
import { getCurrentUser, userAdmin } from "@/lib/auth"
import { createDB } from "@/lib/db"
import { Application } from "@/lib/definitions"
import { eq } from "drizzle-orm"

export async function deleteApplication(appId: string) {
    if (!await userAdmin()) return {
        success: false,
        message: "Insufficient authority"
    }
    const db = await createDB()
    await db.delete(application).where(eq(application.id, appId))
    return {
        success: true,
        message: "Deleted application"
    }
}

export async function createApplication(appData: Omit<Application, "createdById" | "id">) {
    const user = await getCurrentUser()
    if (!user?.admin) return {
        success: false,
        message: "Insufficient authority"
    }
    const db = await createDB()
    await db.insert(application).values({
        ...appData,
        createdById: user.id,
        id: crypto.randomUUID()
    })
    return {
        success: true,
        message: "Created service"
    }
}

export async function editApplication(appData: Application) {
    const user = await getCurrentUser()
    if (!user?.admin) return {
        success: false,
        message: "Insufficient authority"
    }
    const db = await createDB()
    await db.update(application).set({
        ...appData,
    }).where(eq(application.id, appData.id))
    return {
        success: true,
        message: "Edited application"
    }
}