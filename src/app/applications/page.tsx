
import Toast from "@/components/toast"

import EditApplication from "./edit"
import { getCurrentUser } from "@/lib/auth"
import { getService } from "@/lib/public"

export default async function ApplicationsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const user = await getCurrentUser({ applications: true })

    const { create, sid } = await searchParams

    const se = (typeof create == "string" && sid) && await getService(Array.isArray(sid) ? sid[0] : sid) || null

    if (!user || !user.applications) return (
        <Toast message="Failed to load" type={"error"}></Toast>
    )

    return (
        <div className="p-4">
            <h1 className="text-2xl font-mono text-blue-800">Manage applications</h1>
            <EditApplication applications={user.applications} service={se}>

            </EditApplication>
        </div>
    )
}