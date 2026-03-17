"use client"
import { AreYouSureContext } from "@/components/areyousure";
import Button from "@/components/button";
import Card from "@/components/card";
import { Application, doServer } from "@/lib/definitions";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import toast from "react-hot-toast";
import { deleteApplication } from "../actions/application";

export default function ApplicationCard({ a, edit }: { a: Application, edit: () => void }) {
    const openConfirmation = useContext(AreYouSureContext)
    const router = useRouter()
    return (
        <Card small className="w-50! gap-2" cardTitle={a.name}>
            <Button onClick={() => openConfirmation({
                cardTitle: `Delete ${a.name}?`,
                body: `Are you sure you want to PERMANENTLY delete application ${a.name}. This will delete all keys using it.`,
                onConfirm: () =>
                    toast.promise(() =>
                        doServer(deleteApplication(a.id)),
                        { loading: "Deleting application", error: ({message}) => `Failed to delete application: ${message}`, success: "Deleted application" }
                    ).then(() => router.refresh())
            }
            )} className="p-1! bg-blue-400!">Delete</Button>
            <Button onClick={() => edit()} className="p-1! bg-blue-400!">Edit</Button>
        </Card>
    )
}