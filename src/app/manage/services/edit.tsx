"use client"
import { AreYouSureContext } from "@/components/areyousure"
import Button from "@/components/button"
import IconItem from "@/components/iconitem"
import Modal from "@/components/modal"
import Toggle from "@/components/toggle"
import { Service } from "@/lib/definitions"
import { Add, ArrowBackIos, ArrowForwardIos, EditCalendar } from "@nine-thirty-five/material-symbols-react/sharp"
import dayjs from "dayjs"
import { forwardRef, PropsWithChildren, Ref, useContext, useState } from "react"
import { DatePicker } from "react-datepicker"

export default forwardRef(function ({ s, children }: { s: Service | null } & PropsWithChildren) {

    const [name, setName] = useState(s?.name || "")
    const [description, setDescription] = useState(s?.description || "")
    const [apiUrl, setApiUrl] = useState(s?.apiUrl || "")
    const [docsUrl, setDocsUrl] = useState(s?.docsUrl || "")
    const [depreciation, setDepreciation] = useState(!!s?.depreciationTime)
    const [depreciationTime, setDepreciationTime] = useState(s?.depreciationTime)

    const [visible, setVisible] = useState(false)

    const openAreYouSure = useContext(AreYouSureContext)

    return (
        <>
            <Button onClick={() => setVisible(true)}><IconItem icon={{ Icon: Add, className: "h-4" }}>Create</IconItem></Button>
            {children}
            <Modal open={visible} className="bg-white items-start" cardTitle={`Editing ${name || "New service"}`}>
                <div className="px-4 flex flex-col w-full">

                    <label htmlFor="serviceName">
                        Name
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

                    <label htmlFor="apiUrl" className="mt-2">
                        API endpoint
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

                    <label htmlFor="depreciation" className="mt-2">
                        Depreciated
                    </label>
                    <Toggle state={depreciation} setState={setDepreciation}></Toggle>

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
                    <span className="w-full flex gap-2 justify-center mt-2">
                        <Button className="bg-blue-400!" onClick={() => openAreYouSure({
                            body: "Are you sure you want to PERMANENTLY discard these changes?",
                            cardTitle: "Discard changes?",
                            onConfirm: () => setVisible(false)
                        })}>Cancel</Button>
                        <Button>Save</Button>
                    </span>
                </div>
            </Modal>
        </>
    )

})