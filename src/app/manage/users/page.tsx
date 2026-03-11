import { getUsers } from "@/app/actions/user"
import Searchable from "@/components/searchable"
import UserCard from "./card"

export default async function UsersManagePage() {
    const users = await getUsers()
    return (
        <div className="p-4">
            <h1 className="text-2xl font-mono text-blue-800">Manage users</h1>
            <Searchable items={users.map((u, i) => ({
                content: <UserCard key={i} u={u}></UserCard>,
                id: u.id,
                name: u.name || u.id
            }))}></Searchable>
        </div>
    )
}