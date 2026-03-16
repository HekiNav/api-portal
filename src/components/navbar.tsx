"use client"
import { ReactNode, useContext } from "react"
import { NotificationContext, UserContext } from "../app/user-provider"
import IconItem from "./iconitem"
import Link from "next/link"
import Button from "./button"
import { Inbox, OpenInNew, Person } from "@nine-thirty-five/material-symbols-react/sharp"

export default function NavBar() {
    const user = useContext(UserContext)
    const [notifications] = useContext(NotificationContext)

    const items: { url: string, item: ReactNode }[] = [
        { url: "/services/", item: "APIs"},
        { url: "https://github.com/HekiNav/api-portal", item: (<span className="flex flex-row items-center">GitHub<OpenInNew className="h-4"/></span>) },
    ]
    if (user?.admin) items.splice(items.length - 1, 0, { url: "/manage", item: (<span className="text-blue-600">Manage</span>) })

    return (
        <div className="w-full flex flex-row justify-between p-2 items-center font-sans">
            <div className="flex flex-row w-full h-min font-medium">
                <Link href="/" className="font-mono pr-4 text-blue-800">Hekinav API Portal</Link>
                <div className="divide-x-2 divide-blue-800 flex">
                    {...items.map(({ url, item }, i) => (
                        <Link key={i} href={url} className="px-1">{item}</Link>
                    ))}
                </div>

            </div>
            <div>
                {user ?
                    <div className="flex flex-row flex-nowrap gap-2 items-center ">
                        <Link href="/user/me" className="h-full flex flex-col content-center">
                            <IconItem icon={{ Icon: Person, className: `h-5 ${user.admin ? "text-blue-600" : "text-blue-800"}` }}>{user.name || user.id}</IconItem>
                        </Link>
                        <Link href="/inbox" className="h-full flex flex-col content-center">
                            <IconItem icon={{ Icon: Inbox, className: notifications?.some(n => !n.read) ? `after:absolute after:bg-red-600 after:rounded-full after:p-1 after:-top-0.5 after:-left-0.5 relative h-5` : "h-5" }}>Inbox</IconItem>
                        </Link>
                        <Link href="/logout" className="text-nowrap ml-4">
                            <Button className="px-2 py-1 font-medium">Log out</Button>
                        </Link>
                    </div> :
                    <Link href="/login" className="text-nowrap">
                        <Button className="px-2 py-1 font-medium">Log in</Button>
                    </Link>
                }
            </div>
        </div>
    )
}