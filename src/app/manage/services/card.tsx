"use client"
import { deleteService } from "@/app/actions/service";
import { AreYouSureContext } from "@/components/areyousure";
import Button from "@/components/button";
import Card from "@/components/card";
import { doServer, Service } from "@/lib/definitions";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import toast from "react-hot-toast";

export default function ServiceCard({ s, edit }: { s: Service, edit: () => void }) {
    const openConfirmation = useContext(AreYouSureContext)
    const router = useRouter()
    return (
        <Card small className="w-50! gap-2" cardTitle={s.name}>
            <span className="px-2">
                {s.description}
            </span>
            <Button onClick={() => openConfirmation({
                cardTitle: `Delete ${s.name}?`,
                body: `Are you sure you want to PERMANENTLY delete service ${s.name}. This will delete all keys using it.`,
                onConfirm: () =>
                    toast.promise(() =>
                        doServer(deleteService(s.id)),
                        { loading: "Deleting service", error: ({message}) => `Failed to delete service: ${message}`, success: "Deleted service" }
                    ).then(() => router.refresh())
            }
            )} className="p-1! bg-blue-400!">Delete</Button>
            <Button onClick={() => edit()} className="p-1! bg-blue-400!">Edit</Button>
        </Card>
    )
}