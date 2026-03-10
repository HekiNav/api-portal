import { getUsers } from "@/app/actions/user"
import Card from "@/components/card"

export default async function UsersManagePage() {
    const users = await getUsers()
    return (
        <div className="p-4">
            <h1 className="text-2xl font-mono text-blue-800">Manage users</h1>
            {...users.map((u, i) => (
                <Card small className="w-30!" cardTitle={u.name || u.id} key={i}>

                </Card>
            ))}
        </div>
    )
}