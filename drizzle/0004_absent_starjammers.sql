CREATE TABLE `Application` (
	`id` text PRIMARY KEY NOT NULL,
	`createdById` text NOT NULL,
	`name` text NOT NULL,
	FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `ApplicationService` (
	`applicationId` text NOT NULL,
	`serviceId` text NOT NULL
);
