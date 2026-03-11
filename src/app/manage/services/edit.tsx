"use client"
import Modal from "@/components/modal"
import { Service } from "@/lib/definitions"

export default function EditServiceModal({ s }: { s: Service | null }) {
    return (
        <Modal open className="bg-white" cardTitle={`Editing ${s?.name || "new service"}`}>
        </Modal>
    )

}