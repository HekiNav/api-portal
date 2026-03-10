"use server"
import IconItem from "@/components/iconitem";
import Toast from "@/components/toast";
import { getCurrentUser } from "@/lib/auth";
import { Dns, Home, Person } from "@nine-thirty-five/material-symbols-react/sharp";
import Link from "next/link";

const managePages = [
    {
        id: "",
        title: "Home",
        icon: Home
    },
    {
        id: "users",
        title: "Users",
        icon: Person
    },
    {
        id: "services",
        title: "Services",
        icon: Dns
    }
]

export default async function ManageLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const user = await getCurrentUser()
    if (!user?.admin) return <>
        <Toast message="You ned to be an admin to access this." type="info" redirectUrl="/"></Toast>
    </>
    return (
        <div className="flex-row flex divide-x-2 divide-blue-800 h-full w-full">
            <div className="flex flex-col h-full overflow-y-scroll divide-y-2 divide-blue-800 w-50 h-full  p-4 ">
                {...managePages.map(({id, title, icon},index) => (
                    <Link key={index} href={`/manage/${id}`}>
                        <IconItem icon={{Icon: icon, className: "py-2 h-8 text-blue-800"}}>{title}</IconItem>
                    </Link>
                ))}
            </div>
            {children}
        </div>
    );
}