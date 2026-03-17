"use server"
import { application, applicationService } from "@/db/schema"
import { getCurrentUser, userAdmin } from "@/lib/auth"
import { createDB } from "@/lib/db"
import { objectMatch } from "@/lib/definitions"
import { and, eq } from "drizzle-orm"
import { BatchItem } from "drizzle-orm/batch"

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

export async function createApplication(appData: {name: string, services: {id: string}[]}) {
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

export async function editApplication(appData: {name: string, id: string, services: {id: string}[]}): Promise<{ success: boolean; message: string;}> {
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

    if (!objectMatch({...previousAppData, services: null}, {...application, services: null})) await db.update(application).set({
        ...appData,
    }).where(eq(application.id, appData.id))

    const batch: BatchItem<"sqlite">[] = []

    previousAppData.services.forEach(s => {
        if (appData.services.some(service => objectMatch(s, service))) return 
        else {
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