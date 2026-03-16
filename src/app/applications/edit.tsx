"use client"
import { AreYouSureContext } from "@/components/areyousure"
import Button from "@/components/button"
import IconItem from "@/components/iconitem"
import Modal from "@/components/modal"
import Searchable from "@/components/searchable"
import { Application, doServer, FormErrors, Service } from "@/lib/definitions"
import { Add, Remove } from "@nine-thirty-five/material-symbols-react/sharp"
import { useRouter } from "next/navigation"
import { useContext, useEffect, useState } from "react"
import toast from "react-hot-toast"
import z from "zod"
import ApplicationCard from "./card"
import Card from "@/components/card"

export const ApplicationEditSchema = z.object({
    name: z.string().min(2).max(50),
    services: z.array(z.object({

    })).min(1, {error: "Please add at least one service"}).max(5, {error: "Max. 5 servies per app are allowed"})
})


export default function EditApplication({ applications, service }: { applications: Application[], service?: Service | null }) {


    const [a, setA] = useState<Application | null>(null)

    useEffect(() => {
        setName(a?.name || "")
    }, [a])

    const [name, setName] = useState(a?.name || "")

    const [services, setServices] = useState<Service[]>(a?.services?.reduce((p, c) => c.service ? [...p, c.service] : p, new Array<Service>()) || service && [service] || [])

    const [visible, setVisible] = useState(!!service)

    const openAreYouSure = useContext(AreYouSureContext)

    const [errors, setErrors] = useState<FormErrors<["name", "services"]>>({})
    const [success, setSuccess] = useState(false)

    const router = useRouter()

    useEffect(() => {
        const { success, error } = z.safeParse(ApplicationEditSchema, {
            name,
        })
        setSuccess(success)
        setErrors(error ? z.treeifyError(error).properties || {} : {})
    }, [name])

    return (
        <>
            <Button onClick={() => setVisible(true)}><IconItem icon={{ Icon: Add, className: "h-4" }}>Create</IconItem></Button>
            {applications.length ? <Searchable items={applications.map((app, i) => ({
                content: <ApplicationCard edit={() => {
                    setA(app)
                    setVisible(true)
                }} key={i} a={app}></ApplicationCard>,
                id: app.id,
                name: app.name,
            }))}></Searchable> : <p>No applications</p>}
            <Modal open={visible} className="bg-white items-start w-120! max-h-8/10 overflow-y-scroll" cardTitle={`Editing ${name || "New application"}`}>
                <div className="px-4 flex flex-col w-full h-full">
                    <span><span className="text-blue-600">*</span> Required</span>
                    <label htmlFor="applicationName">
                        Name<span className="text-blue-600 ml-1">*</span>
                    </label>
                    <input
                        placeholder="New application"
                        autoComplete="name"
                        type="text"
                        id="applicationName"
                        name="applicationName"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="my-1 border-black border-3 p-1 text-blue-800 accent-blue-800 w-full"
                    />
                    <span className="text-blue-400">{(name.length && errors.name?.errors) || ""}</span>

                    <label htmlFor="applicationName">
                        Services<span className="text-blue-600 ml-1">*</span>
                    </label>
                    <Button className="p-0.5! flex w-fit mb-1 items-center justify-center"><Add className="h-4 w-4"></Add> Add</Button>
                    {...services.map((s, i) => (
                        <Card key={i} small className="w-fit px-1! pb-0! flex-row gap-2">
                            {s.name} <Button className="p-0!"><Remove className="h-4 w-4"></Remove></Button>
                        </Card>
                    ))}
                    <span className="text-blue-400">{(name.length && errors.services?.errors) || ""}</span>

                    <span id="visibility" className="w-full flex gap-2 justify-center mt-2">
                        <Button className="bg-blue-400!" onClick={() => openAreYouSure({
                            body: "Are you sure you want to PERMANENTLY discard these changes?",
                            cardTitle: "Discard changes?",
                            onConfirm: () => setVisible(false)
                        })}>Cancel</Button>
                        <Button className="transition duration-500 ease-in-out" disabled={!success} onPress={() => !a ? toast.promise(doServer(new Promise((res) => res({ success: false, message: "no func" }))), { loading: "Creating application", success: "Created application!", error: ({ message }) => `Could not create application: ${message}` }).then(() => {
                            router.refresh()
                            setVisible(false)
                        }) : toast.promise(doServer(new Promise((res) => res({ success: false, message: "no func" }))), { loading: "Editing application", success: "Edited application!", error: ({ message }) => `Could not edit application: ${message}` }).then(() => {
                            router.refresh()
                            setVisible(false)
                        })
                        }>Save</Button>
                    </span>
                </div>
            </Modal>
        </>
    )

}