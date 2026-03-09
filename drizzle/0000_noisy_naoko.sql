CREATE TABLE `Notification` (
	`creationTime` integer NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`recipientId` text NOT NULL,
	`type` text NOT NULL,
	`message` text NOT NULL,
	`senderId` text,
	`read` integer NOT NULL,
	`title` text NOT NULL,
	FOREIGN KEY (`recipientId`) REFERENCES `User`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`senderId`) REFERENCES `User`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `OtpCode` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`codeHash` text NOT NULL,
	`expiresAt` integer NOT NULL,
	`used` integer NOT NULL,
	`createdAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `Session` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`expiresAt` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `User` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`admin` integer NOT NULL,
	`email` text NOT NULL,
	`createdAt` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `User_email` ON `User` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `Username` ON `User` (`name`);