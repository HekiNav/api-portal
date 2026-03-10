"use client"
import { Check, Close, ContentCopy } from "@nine-thirty-five/material-symbols-react/sharp";
import { JSX, useState } from "react";
import { toast } from "react-hot-toast";

export default function CopyItem({content, prefix}:{content: string, prefix: string}){
    const [Icon, setIcon] = useState<JSX.ElementType>(ContentCopy)
    return (
        <span className="text-xs text-gray-700 bg-white px-1 h-min ml-6">
            {prefix}
            {content}
            <button className="ml-1">
                <Icon size="xs" onClick={() => {
                    navigator.clipboard.writeText(content).then(() => {
                        setIcon(Check)
                        setTimeout(() => setIcon(ContentCopy), 1000)
                    }).catch((err) => {
                        setIcon(Close)
                        setTimeout(() => setIcon(ContentCopy), 1000)
                        toast(err)
                    })
                }}></Icon>
            </button>
        </span>
    )
}