import { Close } from "@nine-thirty-five/material-symbols-react/sharp";
import Card, { CardProps } from "./card";

export interface ModalProps extends CardProps {
    open?: boolean
    close?: () => void
    closeButton?: boolean
}

export default function Modal({open=false, close, closeButton = false, ...props}: ModalProps) {
    return (
        <div onClick={(e) => (e.target as HTMLDivElement).id == "close-modal" && close && close()} id="close-modal" hidden={!open} className="flex items-center justify-center absolute w-screen h-screen z-2000 bg-white/50 top-0 left-0">
            <Card {...props} cardTitle={closeButton ? (
                <div className="flex justify-between">
                    {props.cardTitle}
                    <Close onClick={close}></Close>
                </div>
            ) : props.cardTitle}></Card>
        </div>
    )
}