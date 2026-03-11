"use server"
import { session, user, UserState } from "@/db/schema";
import { getCurrentUser, userAdmin } from "@/lib/auth";
import { createDB } from "@/lib/db";
import { EmailSchema, User, UsernameSchema } from "@/lib/definitions";
import { desc, eq } from "drizzle-orm";
import { cookies } from "next/headers";
import z from "zod";

export async function deleteUser(userId?: string) {
    const db = await createDB()

    const currentUser = await getCurrentUser()

    if (!currentUser) return {
        success: false,
        message: "Not logged in!"
    }
    if (userId) {
        if (!currentUser.admin) return {
            success: false,
            message: "Insufficient authority"
        }
        if (currentUser.id == userId) return {
            success: false,
            message: "Cannot delete yourself via Manage. Go to settings instead."
        }
        const userToDelete = await db.query.user.findFirst({
            where: eq(user.id, userId)
        })
        if (!userToDelete) return {
            success: false,
            message: "Could not find user"
        }
        await db.delete(user).where(eq(user.id, userToDelete.id));

    } else {
        await db.delete(user).where(eq(user.id, currentUser.id));
        (await cookies()).delete("session");
    }


    return {
        success: true,
        message: "Deleted user"
    }

}

export async function setUserState(userId: string, state: UserState) {
    const db = await createDB()

    const currentUser = await getCurrentUser()

    if (!currentUser) return {
        success: false,
        message: "Not logged in!"
    }
        if (!currentUser.admin) return {
            success: false,
            message: "Insufficient authority"
        }
        if (currentUser.id == userId) return {
            success: false,
            message: "Cannot ban/unban yourself."
        }
        const userToUpdate = await db.query.user.findFirst({
            where: eq(user.id, userId)
        })
        if (!userToUpdate) return {
            success: false,
            message: "Could not find user"
        }
        await db.update(user).set({
            state: state
        }).where(eq(user.id, userToUpdate.id));

    return {
        success: true,
        message: "Updated user state"
    }

}

export async function changeUsername(newUsername: string) {
    const { success, error, data } = UsernameSchema.safeParse(newUsername)

    const db = await createDB()

    const currentUser = await getCurrentUser()

    if (!currentUser) return {
        success: false,
        message: "Not logged in!"
    }

    if (!success) return {
        success: false,
        message: z.treeifyError(error).errors.join(", ")
    }
    try {
        await db.update(user).set({ name: data }).where(eq(user.id, currentUser.id))
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        if (error.cause.toString().includes("UNIQUE constraint failed: User.name")) return {
            success: false,
            message: "Username alrady in use"
        }
        else {
            return {
                success: false,
                message: "Server error"
            }
        }
    }

    return {
        success: true,
        message: "Changed username"
    }
}
export async function changeEmail(newEmail: string) {
    const { success, error, data } = EmailSchema.safeParse(newEmail)

    const db = await createDB()

    const currentUser = await getCurrentUser()

    if (!currentUser) return {
        success: false,
        message: "Not logged in!"
    }

    if (!success) return {
        success: false,
        message: z.treeifyError(error).errors.join(", ")
    }
    try {
        await db.update(user).set({ email: data }).where(eq(user.id, currentUser.id))
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        if (error.cause.toString().includes("UNIQUE constraint failed: User.email")) return {
            success: false,
            message: "Email alrady in use"
        }
        else {
            return {
                success: false,
                message: "Server error"
            }
        }
    }
    (await cookies()).delete("session");
    return {
        success: true,
        message: "Succesfully changed email!"
    }
}

export async function getUsers(): Promise<User[]|null> {
    if (!await userAdmin()) return null
    const db = await createDB()
    return (await db.query.user.findMany({
        with: {
            sessions: { limit: 1, orderBy: desc(session.expiresAt) }
        }
    })).map(({ sessions, ...user }) => ({ ...user, lastSeen: sessions[0]?.expiresAt }))
}