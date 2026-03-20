"use server"
import { application, applicationService } from "@/db/schema"
import { getCurrentUser } from "@/lib/auth"
import { createDB } from "@/lib/db"
import { objectMatch } from "@/lib/definitions"
import { createToken } from "@/lib/token"
import { and, eq } from "drizzle-orm"
import { BatchItem } from "drizzle-orm/batch"

export async function deleteApplication(appId: string) {
    const db = await createDB()
    await db.delete(application).where(eq(application.id, appId))
    return {
        success: true,
        message: "Deleted application"
    }
}

export async function createApplication(appData: { name: string, services: { id: string }[] }) {
    const user = await getCurrentUser()
    if (!user?.admin) return {
        success: false,
        message: "Insufficient authority"
    }
    const db = await createDB()
    const appId = crypto.randomUUID()

    const { hash, token, prefix } = await createToken()

    await db.insert(application).values({
        ...appData,
        tokenHash: hash,
        tokenPrefix: prefix,
        createdById: user.id,
        id: appId,
    })
    if (appData.services.length > 0) db.batch(
        appData.services.map(s => db.insert(applicationService).values({
            applicationId: appId,
            serviceId: s.id
        })) as unknown as [BatchItem<"sqlite">, ...BatchItem<"sqlite">[]]
    )
    return {
        success: true,
        message: token
    }
}

export async function editApplication(appData: { name: string, id: string, services: { id: string }[] }): Promise<{ success: boolean; message: string; }> {
    const user = await getCurrentUser()
    if (!user?.admin) return {
        success: false,
        message: "Insufficient authority"
    }
    const db = await createDB()

    const previousAppData = await db.query.application.findFirst({
        where: eq(application.id, appData.id),
        with: {
            services: true
        }
    })
    console.log(previousAppData)
    if (!previousAppData) return {
        success: false,
        message: "Unable to find map"
    }

    if (!objectMatch({ ...previousAppData, services: null }, { ...application, services: null })) await db.update(application).set({
        ...appData,
    }).where(eq(application.id, appData.id))

    const batch: BatchItem<"sqlite">[] = []

    previousAppData.services.forEach(s => {
        if (appData.services.some(service => objectMatch(s, service))) return
        else if (!appData.services.some(service => service.id == s.serviceId)) {
            batch.push(db.delete(applicationService).where(
                and(
                    eq(applicationService.applicationId, appData.id),
                    eq(applicationService.serviceId, s.serviceId)
                )
            ))
        }
    })
    appData.services.forEach(s => {
        if (previousAppData.services.some(service => service.serviceId == s.id)) return
        batch.push(db.insert(applicationService).values({
            applicationId: appData.id,
            serviceId: s.id
        }))
    })

    if (batch.length > 0) await db.batch(batch as [BatchItem<"sqlite">, ...BatchItem<"sqlite">[]])

    return {
        success: true,
        message: "Edited application"
    }
}

export async function regenerateToken(appId: string): Promise<{ success: boolean; message: string; }> {
    const user = await getCurrentUser()
    if (!user) return {
        success: false,
        message: "Not logged in"
    }

    const db = await createDB()

    const appData = await db.query.application.findFirst({
        where: eq(application.id, appId),
        with: {
            services: true
        }
    })

    if (!appData) return {
        success: false,
        message: "Unable to find map"
    }

    if (appData.createdById != user.id) return {
        success: false,
        message: "Insufficient authority"
    }

    const { hash, token, prefix } = await createToken()

    await db.update(application).set({
        tokenHash: hash,
        tokenPrefix: prefix
    }).where(eq(application.id, appData.id))

    return {
        success: true,
        message: token
    }
}