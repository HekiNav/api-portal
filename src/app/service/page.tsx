"use server"

import Card from "@/components/card"
import IconItem from "@/components/iconitem"
import Toast from "@/components/toast"
import { getServices } from "@/lib/public"
import { Person } from "@nine-thirty-five/material-symbols-react/sharp"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import Link from "next/link"
dayjs.extend(relativeTime)

export default async function ServicesPage() {
    const services = await getServices()
    if (!services || !services.length) return <div>
        No services
        <Toast message="Could not get services" type="info"></Toast>
    </div>
    return (
        <div className="flex p-4 gap-2 flex flex-row flex-wrap">
            {...services.map((s, i) => (
                <Link href={`/app/new${s.id}`}  key={i}>
                    <Card className="items-start" cardTitle={<span className="flex justify-between">{s.name} <Link href={`/user/${s.createdById}`}><IconItem icon={{ Icon: Person }}>{s.createdBy?.name}</IconItem></Link></span>}>
                        <div className="attributes flex flex-wrap gap-2">
                            <span className="mx-2 p-1 bg-blue-400" hidden={!s.depreciationTime}>This Service is depreciated - Support ends on {dayjs(s.depreciationTime).format("DD.M.YYYY")}</span>
                            <span className="mx-2 p-1 bg-blue-400">{s.keyRequired ? "Key required" : "Open - no keys"}</span>
                        </div>
                        <span className="px-2 mb-2">
                            Created {dayjs(s.creationTime).fromNow()} &middot; Edited {dayjs(s.updateTime).fromNow()}
                        </span>
                        <span className="px-2 text-lg  border-t-2 w-full border-blue-800 pt-2">Description</span>
                        <span className="px-2">
                            {s.description}
                        </span>
                        <span className="px-2 text-lg">Docs</span>
                        <Link href={s.docsUrl || ""} className="px-2 text-blue-600">
                            {s.docsUrl}
                        </Link>
                        <span className="px-2 text-lg">API Endpoint</span>
                        <Link href={s.apiUrl || ""} className="px-2 text-blue-600">
                            {s.apiUrl}
                        </Link>
                    </Card>
                </Link>
            ))}
        </div>
    )
}