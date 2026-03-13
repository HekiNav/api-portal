"use client"
import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    onPress?: (e: React.KeyboardEvent<HTMLButtonElement> | React.MouseEvent<HTMLButtonElement>) => void
}

export default function Button(propsWithOnPress: ButtonProps) {
    const {onPress, ...props} = propsWithOnPress
    const red = props.className?.includes("bg-red-600")
    const green = props.className?.includes("bg-green-600")
    return (<button
        {...{
            ...props,
            onClick: (e) => { if(props.onClick) props.onClick(e); if(onPress) onPress(e) },
            onKeyDown: (e) => { if(props.onKeyDown) props.onKeyDown(e); if(e.key == "Enter" && onPress) onPress(e) }, className: `${red ? "active:bg-red-700": green ? "active:bg-green-700" :"active:bg-blue-900"} bg-blue-800 cursor-pointer text-white p-2 ${props.disabled ? red ? "bg-red-700": green ? "bg-green-700": "bg-blue-300!" : ""} ${props.className}`
        }}
    >
        {props.children}
    </button>)
}
