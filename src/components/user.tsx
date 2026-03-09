"use client"
import { User } from "@/lib/definitions";
import CopyItem from "./copy";
import dayjs from "dayjs"
import { useContext } from "react";
import { UserContext } from "@/app/user-provider";

export default function UserUI({ user, isCurrentUser = false }: { user: User, isCurrentUser?: boolean }) {
    return (
        <div className="flex flex-col p-4 pb-0 font-sans">
            <div className="flex flex-row bg-blue-800 rounded-xl p-4 text-2xl font-mono text-white items-center">
                {user?.name} {isCurrentUser && "(you)"}  <CopyItem prefix="ID:" content={user.id}></CopyItem>
                <span hidden={!user.admin} className="text-xs text-red-600 bg-white rounded px-1 h-min ml-1">admin</span>
            </div>
            <div className="py-1">
                Created {dayjs(user?.createdAt).fromNow()} &middot;
                Last seen {Math.abs(Date.now() - (user?.lastSeen?.getTime() || 0)) > 1000 * 3600 * 24 * 10 ? dayjs((user?.lastSeen?.getTime()||0) - 1000 * 3600 * 24 * 8).fromNow() : "recently"}
            </div>
        </div>
    )
}