CREATE TABLE `Service` (
	`id` text PRIMARY KEY NOT NULL,
	`createdById` text NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`docsUrl` text,
	`apiUrl` text NOT NULL,
	`version` integer NOT NULL,
	`updateTime` integer NOT NULL,
	`creationTime` integer NOT NULL,
	`visibility` integer NOT NULL,
	FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON UPDATE cascade ON DELETE cascade
);
