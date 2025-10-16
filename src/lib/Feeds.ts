import { feedsTable, sourcesTable } from "@/db/schema";
import { user } from "@/db/schema-auth";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";

type UserId = typeof user.$inferSelect.id;

export async function getFeeds(userId?: UserId) {
  if (!userId) return;
  const feeds = await db.query.feedsTable.findMany({
    with: {
      feedsToSources: {
        with: {
          source: true,
        },
      },
    },
    where: eq(feedsTable.userId, userId),
  });

  console.log(feeds);

  // await new Promise((r) => setTimeout(r, 10000));

  return feeds;
}
