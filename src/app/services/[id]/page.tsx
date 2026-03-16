"use server"

import Button from "@/components/button"
import Card from "@/components/card"
import IconItem from "@/components/iconitem"
import Toast from "@/components/toast"
import { getService } from "@/lib/public"
import { Person } from "@nine-thirty-five/material-symbols-react/sharp"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import Link from "next/link"
dayjs.extend(relativeTime)

export default async function ServicePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    if (!id) return <div>
        <Toast message="Empty or invalid service id" type="error"></Toast>
    </div>
    const s = await getService(id)
    if (!s) return <div>
        No services
        <Toast message="Could not get service" type="error"></Toast>
    </div>
    return (
        <div className="flex p-4 gap-2 flex mt-20 w-full h-full justify-center">
            <Card className="items-start w-200! h-min" cardTitle={<span className="flex justify-between">{s.name} <Link href={`/user/${s.createdById}`}><IconItem icon={{ Icon: Person }}>{s.createdBy?.name}</IconItem></Link></span>}>
                <div className="mx-2 attributes flex flex-wrap gap-2">
                    <span className="p-1 bg-blue-400" hidden={!s.depreciationTime}>This Service is depreciated - Support ends on {dayjs(s.depreciationTime).format("DD.M.YYYY")}</span>
                    <span className="p-1 bg-blue-400">{s.keyRequired ? "Key required" : "Open - no keys required"}</span>
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
                <Link href={`/applications?create&sid=${s.id}`} className="px-2 mt-2">
                    <Button>Create a key</Button>
                </Link>
            </Card>
        </div>
    )
}