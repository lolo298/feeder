import { relations, sql } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const sourcesTable = sqliteTable("sources", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  description: text().notNull(),
  url: text().notNull(),
  feedUrl: text().notNull().unique(),
  checkedAt: int({ mode: "timestamp" }).notNull().default(new Date(0)),
  ttl: int().notNull().default(60),
  iconUrl: text(),
});

export const sourcesRelations = relations(sourcesTable, ({ many }) => ({
  posts: many(postsTable),
}));

export const postsTable = sqliteTable("posts", {
  id: int().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
  description: text().notNull(),
  postUrl: text().notNull(),
  content: text().notNull(),

  postedAt: int({ mode: "timestamp" }),
  imageUrl: text(),

  sourceId: int().notNull(),
  authorId: int().notNull(),
});

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

export const authorsTable = sqliteTable("authors", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
});

export const authorsRelations = relations(authorsTable, ({ many }) => ({
  posts: many(postsTable),
}));
