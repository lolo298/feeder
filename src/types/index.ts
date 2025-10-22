import * as schema from "@/db/schema";
import type { db } from "@/lib/db";
import type { BuildQueryResult, DBQueryConfig, ExtractTablesWithRelations } from "drizzle-orm";

type Schema = typeof schema;
type TSchema = ExtractTablesWithRelations<Schema>;

type IncludeRelation<TableName extends keyof TSchema> = DBQueryConfig<
  "one" | "many",
  boolean,
  TSchema,
  TSchema[TableName]
>["with"];

type InferResultType<
  TableName extends keyof TSchema,
  With extends IncludeRelation<TableName> | undefined = undefined
> = BuildQueryResult<
  TSchema,
  TSchema[TableName],
  {
    with: With;
  }
>;

export type Post = InferResultType<"postsTable">;
export type PostWithAuthor = InferResultType<"postsTable", { author: true }>;
export type Author = InferResultType<"authorsTable">;
export type Feed = InferResultType<"feedsTable">;
export type Source = InferResultType<"sourcesTable">;
export type SourceWithPosts = InferResultType<"sourcesTable", { posts: true }>;
export type SourceWithPostsWithAuthor = InferResultType<
  "sourcesTable",
  { posts: { with: { author: true } } }
>;
