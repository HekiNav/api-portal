import { createDB } from "@/lib/db"
import { eq } from "drizzle-orm"
import { NextRequest } from "next/server"
import bcrypt from "bcrypt"
import { application, applicationService } from "@/db/schema"

export async function GET(req: NextRequest) {

    const params = req.nextUrl.searchParams

    const sid = params.get("sid")
    const token = params.get("token")

    const prefix = token?.slice(5, 13)

    if (!token || !prefix || !sid || typeof token != "string" || typeof sid != "string") return Response.json(invalidMessage, { status: 400, statusText: "Bad Request" })

    const db = await createDB()


    const app = await db.query.application.findFirst({
        where: eq(application.tokenPrefix, prefix),
        with: {
            services: {
                where: eq(applicationService.serviceId, sid)
            }
        }
    })

    if (!app || !app.services.some(a => a.serviceId == sid)) return Response.json({success: false, message: "Failed to find service/token match"}, { status: 400, statusText: "Bad Request" })

    if (!await bcrypt.compare(token, app?.tokenHash || "")) return Response.json({success: false, message: "Invalid or expired token"}, { status: 400, statusText: "Bad Request" })

    return Response.json({
        success: true,
        message: prefix
    })
}

const invalidMessage = {
    success: false,
    message: "400 Bad Request: Request must have string params: 'sid', 'token'"
}