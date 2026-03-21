"use client"
import { createService, editService } from "@/app/actions/service"
import { AreYouSureContext } from "@/components/areyousure"
import Button from "@/components/button"
import Dropdown from "@/components/dropdown"
import IconItem from "@/components/iconitem"
import Modal from "@/components/modal"
import Searchable from "@/components/searchable"
import Toggle from "@/components/toggle"
import { Visibility } from "@/db/schema"
import { doServer, FormErrors, Service } from "@/lib/definitions"
import { Add, ArrowBackIos, ArrowForwardIos, EditCalendar } from "@nine-thirty-five/material-symbols-react/sharp"
import dayjs from "dayjs"
import { useRouter } from "next/navigation"
import { useContext, useEffect, useState } from "react"
import { DatePicker } from "react-datepicker"
import toast from "react-hot-toast"
import z from "zod"
import ServiceCard from "./card"

export const visibilityItems = [
    {
        id: Visibility.HIDDEN,
        content: "Hidden"
    },
    {
        id: Visibility.PRIVATE,
        content: "Private"
    },
    {
        id: Visibility.PUBLIC,
        content: "Public"
    }
]

export const ServiceEditSchema = z.object({
    name: z.string().min(2).max(50),
    description: z.string().max(200).nullable(),
    apiUrl: z.url(),
    docsUrl: z.url().nullable(),
    depreciationTime: z.date().nullable()
})


export default function EditService({ services }: { services: Service[] }) {

    const [s, setS] = useState<Service | null>(null)

    useEffect(() => {
        setName(s?.name || "")
        setDescription(s?.description || "")
        setApiUrl(s?.apiUrl || "")
        setDocsUrl(s?.docsUrl || "")
        setDepreciation(!!s?.depreciationTime)
        setKeyRequired(!!s?.depreciationTime || false)
        setDepreciationTime(s?.depreciationTime)
        setVisibility(s?.visibility || Visibility.PRIVATE)
    }, [s])

    const [name, setName] = useState(s?.name || "")
    const [description, setDescription] = useState(s?.description || "")
    const [apiUrl, setApiUrl] = useState(s?.apiUrl || "")
    const [docsUrl, setDocsUrl] = useState(s?.docsUrl || "")
    const [depreciation, setDepreciation] = useState(!!s?.depreciationTime)
    const [keyRequired, setKeyRequired] = useState(!!s?.depreciationTime || false)
    const [depreciationTime, setDepreciationTime] = useState(s?.depreciationTime)
    const [visibility, setVisibility] = useState<Visibility>(s?.visibility || Visibility.PRIVATE)

    const [visible, setVisible] = useState(false)

    const openAreYouSure = useContext(AreYouSureContext)

    const [errors, setErrors] = useState<FormErrors<["name", "description", "apiUrl", "docsUrl", "depreciation", "depreciationTime"]>>({})
    const [success, setSuccess] = useState(false)

    const router = useRouter()

    useEffect(() => {
        const { success, error } = z.safeParse(ServiceEditSchema, {
            name,
            description: description || null,
            apiUrl,
            docsUrl: docsUrl || null,
            depreciationTime: (depreciation && depreciationTime) || null
        })
        setSuccess(success)
        setErrors(error ? z.treeifyError(error).properties || {} : {})
    }, [name, description, apiUrl, docsUrl, depreciation, depreciationTime])

    return (
        <>
            <Button onClick={() => setVisible(true)}><IconItem icon={{ Icon: Add, className: "h-4" }}>Create</IconItem></Button>
            {services.length ? <Searchable items={services.map((se, i) => ({
                content: <ServiceCard edit={() => {
                    setS(se)
                    setVisible(true)
                }} key={i} s={se}></ServiceCard>,
                id: se.id,
                name: se.name,
                description: se.description || ""
            }))}></Searchable> : <p>No services</p>}
            <Modal open={visible} className="bg-white items-start w-120! max-h-8/10 overflow-y-scroll" cardTitle={`Editing ${name || "New service"}`}>
                <div className="px-4 flex flex-col w-full h-full">
                    <span><span className="text-blue-600">*</span> Required</span>
                    <label htmlFor="serviceName">
                        Name<span className="text-blue-600 ml-1">*</span>
                    </label>
                    <input
                        placeholder="New service"
                        autoComplete="name"
                        type="text"
                        id="serviceName"
                        name="serviceName"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="my-1 border-black border-3 p-1 text-blue-800 accent-blue-800 w-full"
                    />
                    <span className="text-blue-400">{(name.length && errors.name?.errors) || ""}</span>

                    <label htmlFor="serviceDescription" className="mt-2">
                        Description
                    </label>
                    <textarea
                        placeholder="Processes x and does y"
                        autoComplete="name"
                        id="serviceDescription"
                        name="serviceDescription"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="my-1 border-black border-3 p-1 text-blue-800 accent-blue-800 w-full"
                    />
                    <span className="text-blue-400">{(description.length && errors.description?.errors) || ""}</span>

                    <label htmlFor="apiUrl" className="mt-2">
                        API endpoint<span className="text-blue-600 ml-1">*</span>
                    </label>
                    <input
                        placeholder="https://example.com/api/v1/"
                        autoComplete="url"
                        type="url"
                        id="apiUrl"
                        name="apiUrl"
                        value={apiUrl}
                        onChange={(e) => setApiUrl(e.target.value)}
                        className="my-1 border-black border-3 p-1 text-blue-800 accent-blue-800 w-full"
                    />
                    <span className="text-blue-400">{(apiUrl.length && errors.apiUrl?.errors) || ""}</span>

                    <label htmlFor="docsUrl" className="mt-2">
                        Docs url
                    </label>
                    <input
                        placeholder="https://example.com/api/v1/docs"
                        autoComplete="url"
                        type="url"
                        id="docsUrl"
                        name="docsUrl"
                        value={docsUrl}
                        onChange={(e) => setDocsUrl(e.target.value)}
                        className="my-1 border-black border-3 p-1 text-blue-800 accent-blue-800 w-full"
                    />
                    <span className="text-blue-400">{(docsUrl.length && errors.docsUrl?.errors) || ""}</span>

                    <label htmlFor="depreciation" className="mt-2">
                        Depreciated
                    </label>
                    <Toggle state={depreciation} setState={setDepreciation}></Toggle>

                    <label htmlFor="keyRequired" className="mt-2">
                        Access key required
                    </label>
                    <Toggle state={keyRequired} setState={setKeyRequired}></Toggle>

                    <label hidden={!depreciation} htmlFor="depreciationTime" className="mt-2">
                        Final support date
                    </label>
                    <div hidden={!depreciation}>
                        <DatePicker
                            className="rounded-none! border-black border-3 p-1 text-blue-800 accent-blue-800 w-full"
                            placeholderText="1.1.1970"
                            dayClassName={() => "rounded-none!"}
                            calendarClassName="border-3! border-blue-800! rounded-none!"
                            icon={<div className="flex"><EditCalendar></EditCalendar></div>}
                            showIcon
                            renderCustomHeader={({
                                date,
                                decreaseMonth,
                                increaseMonth,
                            }) => (
                                <div className="w-full border-b-3 border-blue-800 flex justify-between bg-blue-800 items-center">
                                    <Button onClick={decreaseMonth} className="p-0"><ArrowBackIos /></Button>
                                    <span className="text-white font-mono text-lg">
                                        {dayjs(date).format("MMMM YYYY")}
                                    </span>
                                    <Button onClick={increaseMonth} className="p-0"><ArrowForwardIos /></Button>
                                </div>
                            )}
                            dateFormat="d.M.Y"
                            selected={depreciationTime}
                            onChange={(date: Date | null) => setDepreciationTime(date)}></DatePicker>
                    </div>
                    <span className="text-blue-400">{(depreciation && errors.depreciationTime?.errors) || ""}</span>

                    <label htmlFor="visibility" className="mt-2">
                        Visibility
                    </label>
                    <Dropdown top onSet={(i) => i && i.id && setVisibility(i.id)} items={visibilityItems} initial={visibilityItems.find(i => i.id == visibility)?.content}></Dropdown>

                    <span id="visibility" className="w-full flex gap-2 justify-center mt-2">
                        <Button className="bg-blue-400!" onClick={() => openAreYouSure({
                            body: "Are you sure you want to PERMANENTLY discard these changes?",
                            cardTitle: "Discard changes?",
                            onConfirm: () => setVisible(false)
                        })}>Cancel</Button>
                        <Button disabled={!success} onPress={() => !s ? toast.promise(doServer(createService({
                            visibility,
                            name,
                            description: description || null,
                            apiUrl,
                            docsUrl: docsUrl || null,
                            depreciationTime: (depreciation && depreciationTime) || null,
                            keyRequired
                        })), { loading: "Creating service", success: "Created service!", error: ({ message }) => `Could not create service: ${message}` }).then(() => {
                            router.refresh()
                            setVisible(false)
                        }) : toast.promise(doServer(editService({
                            ...s,
                            visibility,
                            name,
                            description: description || null,
                            apiUrl,
                            docsUrl: docsUrl || null,
                            depreciationTime: (depreciation && depreciationTime) || null,
                            keyRequired
                        })), { loading: "Editing service", success: "Edited service!", error: ({ message }) => `Could not edit service: ${message}` }).then(() => {
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