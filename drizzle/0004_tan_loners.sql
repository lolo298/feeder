PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_authors` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_authors`("id", "name") SELECT "id", "name" FROM `authors`;--> statement-breakpoint
DROP TABLE `authors`;--> statement-breakpoint
ALTER TABLE `__new_authors` RENAME TO `authors`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_feeds` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`user_id` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_feeds`("id", "name", "user_id") SELECT "id", "name", "user_id" FROM `feeds`;--> statement-breakpoint
DROP TABLE `feeds`;--> statement-breakpoint
ALTER TABLE `__new_feeds` RENAME TO `feeds`;--> statement-breakpoint
CREATE TABLE `__new_feeds_to_sources` (
	`feed_id` text NOT NULL,
	`source_id` text NOT NULL,
	PRIMARY KEY(`feed_id`, `source_id`),
	FOREIGN KEY (`feed_id`) REFERENCES `feeds`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`source_id`) REFERENCES `sources`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_feeds_to_sources`("feed_id", "source_id") SELECT "feed_id", "source_id" FROM `feeds_to_sources`;--> statement-breakpoint
DROP TABLE `feeds_to_sources`;--> statement-breakpoint
ALTER TABLE `__new_feeds_to_sources` RENAME TO `feeds_to_sources`;--> statement-breakpoint
CREATE TABLE `__new_posts` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`post_url` text NOT NULL,
	`content` text NOT NULL,
	`posted_at` integer,
	`image_url` text,
	`source_id` text NOT NULL,
	`author_id` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_posts`("id", "title", "description", "post_url", "content", "posted_at", "image_url", "source_id", "author_id") SELECT "id", "title", "description", "post_url", "content", "posted_at", "image_url", "source_id", "author_id" FROM `posts`;--> statement-breakpoint
DROP TABLE `posts`;--> statement-breakpoint
ALTER TABLE `__new_posts` RENAME TO `posts`;--> statement-breakpoint
CREATE TABLE `__new_sources` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`url` text NOT NULL,
	`feed_url` text NOT NULL,
	`checked_at` integer DEFAULT '"1970-01-01T00:00:00.000Z"' NOT NULL,
	`ttl` integer DEFAULT 60 NOT NULL,
	`icon_url` text
);
--> statement-breakpoint
INSERT INTO `__new_sources`("id", "name", "description", "url", "feed_url", "checked_at", "ttl", "icon_url") SELECT "id", "name", "description", "url", "feed_url", "checked_at", "ttl", "icon_url" FROM `sources`;--> statement-breakpoint
DROP TABLE `sources`;--> statement-breakpoint
ALTER TABLE `__new_sources` RENAME TO `sources`;--> statement-breakpoint
CREATE UNIQUE INDEX `sources_feedUrl_unique` ON `sources` (`feed_url`);