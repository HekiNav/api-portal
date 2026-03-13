import Searchable from "@/components/searchable"
import { getServices } from "@/app/actions/service"
import Toast from "@/components/toast"
import ServiceCard from "./card"
import EditService from "./edit"

export default async function UsersManagePage() {
    const services = await getServices()
    if (!services) return (
        <Toast message="Failed to load" type={"error"}></Toast>
    )

    return (
        <div className="p-4">
            <h1 className="text-2xl font-mono text-blue-800">Manage services</h1>
            <EditService services={services}>
                
            </EditService>
        </div>
    )
}