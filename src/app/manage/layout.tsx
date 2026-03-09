"use server"
import IconItem from "@/components/iconitem";
import Toast from "@/components/toast";
import { getCurrentUser } from "@/lib/auth";
import { faHome, faServer, faUser } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const managePages = [
    {
        id: "",
        title: "Home",
        icon: faHome
    },
    {
        id: "users",
        title: "Users",
        icon: faUser
    },
    {
        id: "services",
        title: "Services",
        icon: faServer
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
                        <IconItem icon={{icon, className: "py-2 text-blue-800"}}>{title}</IconItem>
                    </Link>
                ))}
            </div>
            {children}
        </div>
    );
}