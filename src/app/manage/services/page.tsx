import Searchable from "@/components/searchable"
import { getServices } from "@/app/actions/service"
import Toast from "@/components/toast"
import ServiceCard from "./card"
import EditServiceModal from "./edit"

export default async function UsersManagePage() {
    const services = await getServices()
    if (!services) return (
        <Toast message="Failed to load" type={"error"}></Toast>
    )
    console.log(services)
    return (
        <div className="p-4">
            <h1 className="text-2xl font-mono text-blue-800">Manage services</h1>
            {services.length ? <Searchable items={services.map((s, i) => ({
                content: <ServiceCard key={i} s={s}></ServiceCard>,
                id: s.id,
                name: s.name,
                description: s.description
            }))}></Searchable> : <p>No services</p>}
            <EditServiceModal s={null}/>
        </div>
    )
}