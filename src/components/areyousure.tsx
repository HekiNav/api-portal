"use client"
import { createContext, PropsWithChildren, ReactNode, useState } from "react";
import Modal from "./modal";
import Button from "./button";

export interface AreYouSureProps {
    onConfirm?: () => unknown,
    onCancel?: () => unknown,
    cardTitle?: ReactNode,
    body: ReactNode
}
export const AreYouSureContext = createContext<(props: AreYouSureProps) => void>(() => { })
export default function AreYouSure({ children }: PropsWithChildren) {
    const [visible, setVisible] = useState(false)
    const [data, setData] = useState<AreYouSureProps | null>(null)

    function openAreYouSure(props: AreYouSureProps) {
        setVisible(true)
        setData(props)
    }

    return (
        <>
            <AreYouSureContext value={openAreYouSure}>
                {children}
                <Modal className="are-you-sure bg-white" open={visible} close={() => {data?.onCancel && data.onCancel(); setVisible(false)}} cardTitle={data?.cardTitle}>
                    <div className="px-2">
                        {data?.body}
                        <div className="w-full flex gap-4 items-center">
                            <Button onClick={() => {data?.onCancel && data.onCancel(); setVisible(false)}}>Cancel</Button>
                            <Button onClick={() => {data?.onConfirm && data.onConfirm(); setVisible(false)}}>Confirm</Button>
                        </div>
                    </div>
                </Modal>
            </AreYouSureContext>
        </>
    )

}