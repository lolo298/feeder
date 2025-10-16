import { relations, sql } from "drizzle-orm";
import { int, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { user } from "./schema-auth";
import { nanoid } from "nanoid";

export const sourcesTable = sqliteTable("sources", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: text().notNull(),
  description: text().notNull(),
  url: text().notNull(),
  feedUrl: text().notNull().unique(),
  checkedAt: int({ mode: "timestamp" }).notNull().default(new Date(0)),
  ttl: int().notNull().default(60),
  iconUrl: text(),
});

export const postsTable = sqliteTable("posts", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  title: text().notNull(),
  description: text().notNull(),
  postUrl: text().notNull(),
  content: text().notNull(),

  postedAt: int({ mode: "timestamp" }),
  imageUrl: text(),

  sourceId: text().notNull(),
  authorId: text().notNull(),
});

export const authorsTable = sqliteTable("authors", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: text().notNull(),
});

export const feedsTable = sqliteTable("feeds", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: text().notNull(),

  userId: text().notNull(),
});

export const feedsToSources = sqliteTable(
  "feeds_to_sources",
  {
    feedId: text()
      .notNull()
      .references(() => feedsTable.id),
    sourceId: text()
      .notNull()
      .references(() => sourcesTable.id),
  },
  (t) => [primaryKey({ columns: [t.feedId, t.sourceId] })]
);

// ------- RELATIONS -------

export const postsRelations = relations(postsTable, ({ one }) => ({
  source: one(sourcesTable, {
    fields: [postsTable.sourceId],
    references: [sourcesTable.id],
  }),
  author: one(authorsTable, {
    fields: [postsTable.authorId],
    references: [authorsTable.id],
  }),
}));

export const authorsRelations = relations(authorsTable, ({ many }) => ({
  posts: many(postsTable),
}));

export const sourcesRelations = relations(sourcesTable, ({ many }) => ({
  posts: many(postsTable),
  feedsToSources: many(feedsToSources),
}));

export const feedsRelations = relations(feedsTable, ({ one, many }) => ({
  user: one(user, {
    fields: [feedsTable.userId],
    references: [user.id],
  }),
  feedsToSources: many(feedsToSources),
}));

export const userRelations = relations(user, ({ many }) => ({
  feeds: many(feedsTable),
}));

export const feedsToSourcesRelations = relations(feedsToSources, ({ one }) => ({
  feed: one(feedsTable, {
    fields: [feedsToSources.feedId],
    references: [feedsTable.id],
  }),
  source: one(sourcesTable, {
    fields: [feedsToSources.sourceId],
    references: [sourcesTable.id],
  }),
}));
