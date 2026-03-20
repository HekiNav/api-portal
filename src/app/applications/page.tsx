
import Toast from "@/components/toast"

import EditApplication from "./edit"
import { getCurrentUser } from "@/lib/auth"
import { getServices } from "@/lib/public"

export default async function ApplicationsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const user = await getCurrentUser({ applications: true })

    if (!user) return (
        <Toast message="Log in to view your apps" type={"error"} redirectUrl="/login?to=/applications"></Toast>
    )

    const { create, sid } = await searchParams

    const services = await getServices()

    const se = (typeof create == "string" && sid) && services?.find(s => s.id == (Array.isArray(sid) ? sid[0] : sid)) || null

    if (!user || !user.applications || !services) return (
        <Toast message="Failed to load" type={"error"}></Toast>
    )

    return (
        <div className="p-4">
            <h1 className="text-2xl font-mono text-blue-800">Manage applications</h1>
            <EditApplication applications={user.applications} service={se} serviceList={services}>
                
            </EditApplication>
        </div>
    )
}