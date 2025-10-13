import { sourcesTable } from "@/db/schema";
import { db } from "@/lib/db";

export async function getFeeds() {
  const feeds = await db.select().from(sourcesTable);

  // await new Promise((r) => setTimeout(r, 10000));

  return feeds;
}
