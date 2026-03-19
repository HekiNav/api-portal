"use client"
import { Check, Close, ContentCopy } from "@nine-thirty-five/material-symbols-react/sharp";
import { HTMLAttributes, JSX, useState } from "react";
import { toast } from "react-hot-toast";

type IconKey = "copy" | "check" | "close";

const icons: Record<IconKey, React.ElementType> = {
  copy: ContentCopy,
  check: Check,
  close: Close,
};

export default function CopyItem({content, prefix, ...props}:{content: string, prefix: string} & HTMLAttributes<HTMLSpanElement>){
    const [icon, setIcon] = useState<IconKey>("copy")
    const Icon = icons[icon]
    return (
        <span className="text-xs text-gray-700 bg-white ps-1 h-min ml-6 flex items-center" {...props}>
            {prefix}
            {content}
            <button>
                <Icon className="h-3" onClick={() => {
                    navigator.clipboard.writeText(content).then(() => {
                        setIcon("check")
                        setTimeout(() => setIcon("copy"), 1000)
                    }).catch((err) => {
                        setIcon("close")
                        setTimeout(() => setIcon("copy"), 1000)
                        toast(err)
                    })
                }}></Icon>
            </button>
        </span>
    )
}