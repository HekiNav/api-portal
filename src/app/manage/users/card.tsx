"use client"
import { deleteUser, setUserState } from "@/app/actions/user";
import { AreYouSureContext } from "@/components/areyousure";
import Button from "@/components/button";
import Card from "@/components/card";
import { UserState } from "@/db/schema";
import { doServer, User } from "@/lib/definitions";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import toast from "react-hot-toast";

export default function UserCard({ u }: { u: User }) {
    const openConfirmation = useContext(AreYouSureContext)
    const router = useRouter()
    return (
        <Card small className="w-50! gap-2" cardTitle={u.name || u.id}>
            <span className="p-1 bg-blue-800 text-white" hidden={u.state != UserState.BANNED}>BANNED</span>
            <span className="p-1">Last login: {dayjs(u.createdAt).fromNow()}</span>
            <Button onClick={() => openConfirmation({
                cardTitle: `Unban ${u.name || u.id}?`,
                body: `Are you sure you want to unban user ${u.name || u.id}`,
                onConfirm: () =>
                    toast.promise(() =>
                        doServer(setUserState(u.id, UserState.NORMAL)),
                        { loading: "Unbanning user", error: ({message}) => `Failed to unban user: ${message}`, success: "Unbanned user" }
                    ).then(() => router.refresh())
            }
            )} hidden={u.state != UserState.BANNED} className="p-1! bg-blue-400!">Unban</Button>
            <Button onClick={() => openConfirmation({
                cardTitle: `Ban ${u.name || u.id}?`,
                body: `Are you sure you want to ban user ${u.name || u.id}`,
                onConfirm: () =>
                    toast.promise(() =>
                        doServer(setUserState(u.id, UserState.BANNED)),
                        { loading: "Banning user", error: ({message}) => `Failed to ban user: ${message}`, success: "Banned user" }
                    ).then(() => router.refresh())
            }
            )} hidden={u.state == UserState.BANNED} className="p-1! bg-blue-400!">Ban</Button>
            <Button onClick={() => openConfirmation({
                cardTitle: `Delete ${u.name || u.id}?`,
                body: `Are you sure you want to PERMANENTLY delete user ${u.name || u.id}`,
                onConfirm: () =>
                    toast.promise(() =>
                        doServer(deleteUser(u.id)),
                        { loading: "Deleting user", error: ({message}) => `Failed to delete user: ${message}`, success: "Deleted user" }
                    ).then(() => router.refresh())
            }
            )} className="p-1! bg-blue-400!">Delete</Button>
        </Card>
    )
}