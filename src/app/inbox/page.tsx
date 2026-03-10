"use client"

import Card from "@/components/card"
import { useContext, useState } from "react"
import { NotificationContext } from "../user-provider"
import { momentToTZ, Notification } from "@/lib/definitions"
import Modal from "@/components/modal"
import { markAsRead } from "../actions/inbox"
import { Mail, Drafts } from "@nine-thirty-five/material-symbols-react/sharp"


export default function InboxPage() {
    const [modalState, setModalState] = useState<Notification | null>(null)
    const [notifs, reloadNotifs] = useContext(NotificationContext)
    return <div className="flex w-full h-full flex-col items-center py-10 px-10">
        <Card cardTitle="inbox" className="lg:w-6/10! w-full! bg-white">
            <span className=" divide-y-2 w-full px-3">
                {...(notifs || [])?.sort((a,b) =>  new Date(b.creationTime).getTime() - new Date(a.creationTime).getTime()).map((n, i) => (
                    <div key={i} className="px-1 py-2 w-full cursor-pointer flex flex-row justify-between items-center" >
                        <div onClick={() => {
                            setModalState(n)
                            if (!n.read) markAsRead(n.id).then(() => {
                                if (reloadNotifs) reloadNotifs()
                            })
                        }} className={`${!n.read && "font-bold "}text-lg`}>
                            <span className="px-1">{momentToTZ(n.creationTime).fromNow()}</span>
                            <span className="px-1 text-blue-800">{n.title}</span>
                        </div>
                        {n.read ? <Drafts className="h-5" /> : <Mail className="h-5"/>}
                    </div>
                ))}
                {notifs?.length == 0 && (
                    <>
                        No notifications yet
                    </>
                )}
            </span>
            {modalState && (
                <Modal open={!!modalState} title={modalState.title} close={() => {
                    setModalState(null)
                }} className="w-max bg-white">
                    <div className="px-4 notification" dangerouslySetInnerHTML={{ __html: modalState.message }}></div>
                </Modal>
            )}
        </Card>
    </div>
}