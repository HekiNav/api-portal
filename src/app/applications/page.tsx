
import Toast from "@/components/toast"

import EditApplication from "./edit"
import { getCurrentUser } from "@/lib/auth"

export default async function UsersManagePage() {
    const user = await getCurrentUser({applications: true})
    if (!user || !user.applications) return (
        <Toast message="Failed to load" type={"error"}></Toast>
    )

    return (
        <div className="p-4">
            <h1 className="text-2xl font-mono text-blue-800">Manage applications</h1>
            <EditApplication applications={user.applications}>
                
            </EditApplication>
        </div>
    )
}