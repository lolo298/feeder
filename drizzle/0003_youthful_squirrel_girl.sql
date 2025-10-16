CREATE TABLE `feeds_to_sources` (
	`feed_id` integer NOT NULL,
	`source_id` integer NOT NULL,
	PRIMARY KEY(`feed_id`, `source_id`),
	FOREIGN KEY (`feed_id`) REFERENCES `feeds`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`source_id`) REFERENCES `sources`(`id`) ON UPDATE no action ON DELETE no action
);
