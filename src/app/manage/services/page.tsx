import { getUsers } from "@/app/actions/user"
import Button from "@/components/button"
import Card from "@/components/card"
import Searchable from "@/components/searchable"
import { UserState } from "@/db/schema"
import dayjs from "dayjs"

export default async function ServicesManagePage() {
    const users = await getUsers()
    return (
        <div className="p-4">
            <h1 className="text-2xl font-mono text-blue-800">Manage services</h1>
            <Searchable items={users.map((u, i) => ({
                content: <Card small className="w-50! gap-2" cardTitle={u.name || u.id} key={i}>
                    <span className="p-1" hidden={u.state != UserState.BANNED}>BANNED</span>
                    <span className="p-1">Last seen: {dayjs(u.createdAt).fromNow()}</span>
                    <Button hidden={u.state != UserState.BANNED} className="p-1! bg-blue-400!">Unban</Button>
                    <Button hidden={u.state == UserState.BANNED} className="p-1! bg-blue-400!">Ban</Button>
                </Card>,
                id: u.id,
                name: u.name || u.id
            }))}></Searchable>
        </div>
    )
}