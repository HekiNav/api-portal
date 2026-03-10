import { sqliteTable, integer, text, uniqueIndex } from "drizzle-orm/sqlite-core"
import { relations } from "drizzle-orm/relations";

export const notification = sqliteTable("Notification", {
	creationTime: integer({mode: "timestamp_ms"}).notNull(),
	id: text().notNull().primaryKey(),
	recipientId: text().notNull().references(() => user.id, {onDelete: "cascade", onUpdate: "cascade"}),
	type: text().notNull(),
	message: text().notNull(),
	senderId: text().references(() => user.id, {onDelete: "cascade", onUpdate: "cascade"}),
	read: integer({mode: "boolean"}).notNull(),
	title: text().notNull(),
})

export enum UserState {
	BANNED,
	NORMAL
}

export const user = sqliteTable("User", {
	id: text().primaryKey().notNull(),
	state: integer().$type<UserState>(),
	name: text(),
	admin: integer({mode: "boolean"}).notNull(),
	email: text().notNull(),
	createdAt: integer({mode: "timestamp_ms"}).notNull(),
},
	(table) => [
		uniqueIndex("User_email").on(table.email),
		uniqueIndex("Username").on(table.name)
	]);

export const otpCode = sqliteTable("OtpCode", {
	id: text().primaryKey().notNull(),
	email: text().notNull(),
	codeHash: text().notNull(),
	expiresAt: integer({mode: "timestamp_ms"}).notNull(),
	used: integer({mode: "boolean"}).notNull(),
	createdAt: integer({mode: "timestamp_ms"}).notNull(),
});

export const session = sqliteTable("Session", {
	id: text().primaryKey().notNull(),
	userId: text().notNull().references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
	expiresAt: integer({mode: "timestamp_ms"}).notNull(),
});

export const notificationRelations = relations(notification, ({ one }) => ({
	sender: one(user, {
		fields: [notification.senderId],
		references: [user.id]
	}),
	recipient: one(user, {
		fields: [notification.recipientId],
		references: [user.id]
	}),
}));

export const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({ many }) => ({
	sessions: many(session),
}));
