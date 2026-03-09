"use client"
import { redirect } from "next/navigation"
import { useEffect } from "react"
import toast from "react-hot-toast"

export default function Toast({type, message, redirectUrl}: {type: "error" | "info", message: string, redirectUrl?: string}) {
    useEffect(() => {
        if (type == "info") toast(message)
            else toast[type](message)
        if (redirectUrl) redirect(redirectUrl)
    })
    return <div></div>
}