PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_Service` (
	`id` text PRIMARY KEY NOT NULL,
	`createdById` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`docsUrl` text,
	`apiUrl` text NOT NULL,
	`depreciationTime` integer,
	`updateTime` integer NOT NULL,
	`keyRequired` integer NOT NULL,
	`creationTime` integer NOT NULL,
	`visibility` integer NOT NULL,
	FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_Service`("id", "createdById", "name", "description", "docsUrl", "apiUrl", "depreciationTime", "updateTime", "keyRequired", "creationTime", "visibility") SELECT "id", "createdById", "name", "description", "docsUrl", "apiUrl", "depreciationTime", "updateTime", "keyRequired", "creationTime", "visibility" FROM `Service`;--> statement-breakpoint
DROP TABLE `Service`;--> statement-breakpoint
ALTER TABLE `__new_Service` RENAME TO `Service`;--> statement-breakpoint
PRAGMA foreign_keys=ON;