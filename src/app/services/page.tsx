"use server"

import Card from "@/components/card"
import IconItem from "@/components/iconitem"
import Toast from "@/components/toast"
import { getServices } from "@/lib/public"
import { Person } from "@nine-thirty-five/material-symbols-react/sharp"
import Link from "next/link"

export default async function ServicesPage() {
    const services = await getServices()
    if (!services || !services.length) return <div>
        No services
        <Toast message="Could not get services" type="info"></Toast>
    </div>
    return (
        <div className="flex p-4 gap-2 flex flex-row flex-wrap">
            {...services.map((s, i) => (
                <Card className="items-start" cardTitle={<span className="flex justify-between"><Link href={`/services/${s.id}`}>{s.name}</Link> <Link href={`/user/${s.createdById}`}><IconItem icon={{ Icon: Person }}>{s.createdBy?.name}</IconItem></Link></span>}>
                    <Link href={`/services/${s.id}`} className="items-start flex flex-col">
                        <div className="attributes flex flex-wrap gap-2 mx-2">
                            <span className="p-1 bg-blue-400" hidden={!s.depreciationTime}>Depreciated</span>
                            <span className="p-1 bg-blue-400">{s.keyRequired ? "Key required" : "Open - no keys"}</span>
                        </div>
                        <span className="px-2 mt-2">
                            {s.description}
                        </span>
                    </Link>
                </Card>
            ))}
        </div>
    )
}