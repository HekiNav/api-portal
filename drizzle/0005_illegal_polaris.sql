ALTER TABLE `Application` ADD `tokenHash` text NOT NULL;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_ApplicationService` (
	`applicationId` text NOT NULL,
	`serviceId` text NOT NULL,
	FOREIGN KEY (`applicationId`) REFERENCES `Application`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`serviceId`) REFERENCES `Service`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_ApplicationService`("applicationId", "serviceId") SELECT "applicationId", "serviceId" FROM `ApplicationService`;--> statement-breakpoint
DROP TABLE `ApplicationService`;--> statement-breakpoint
ALTER TABLE `__new_ApplicationService` RENAME TO `ApplicationService`;--> statement-breakpoint
PRAGMA foreign_keys=ON;