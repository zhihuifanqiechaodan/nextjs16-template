CREATE TABLE `category` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`sort` int NOT NULL DEFAULT 0,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `category_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `product` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`image` text,
	`category_id` varchar(36),
	`price` decimal(10,2) NOT NULL,
	`original_price` decimal(10,2),
	`description` text,
	`specifications` json,
	`stock` int NOT NULL DEFAULT 0,
	`sort` int NOT NULL DEFAULT 0,
	`status` boolean NOT NULL DEFAULT true,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `product_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `product` ADD CONSTRAINT `product_category_id_category_id_fk` FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON DELETE no action ON UPDATE no action;