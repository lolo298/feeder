import "dotenv/config";
import { authorsTable, feedsTable, feedsToSources, postsTable, sourcesTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";
import { XMLParser } from "fast-xml-parser";
import { session, user } from "@/db/schema-auth";

(async () => {
  const db = drizzle({ connection: process.env.DB_FILE_NAME!, casing: "snake_case" });

  const sources: (typeof sourcesTable.$inferInsert)[] = [
    {
      name: "selfh.st",
      description: "Self-hosted news, content, updates, and more.",
      feedUrl: "https://selfh.st/rss",
      url: "https://selfh.st",
      iconUrl: "https://selfh.st/favicon.png",
    },
  ];
  let insertedSources: (typeof sourcesTable.$inferSelect)[] = [];
  for (const source of sources) {
    const exist = await db
      .select()
      .from(sourcesTable)
      .where(eq(sourcesTable.feedUrl, source.feedUrl));

    let rowId;
    if (exist.length > 0) {
      rowId = exist[0].id;
    } else {
      rowId = (await db.insert(sourcesTable).values(source).returning())[0].id;
    }

    const rawXml = await (await fetch(source.feedUrl)).text();
    const parser = new XMLParser({ ignoreAttributes: false });
    const xml = parser.parse(rawXml);

    const items = xml.rss.channel.item;
    const toInsert: (typeof postsTable.$inferInsert)[] = [];
    for (const post of items) {
      // console.log(post["media:content"]);
      // return;

      const authorName = post["dc:creator"];
      const authorRow = await db
        .select()
        .from(authorsTable)
        .where(eq(authorsTable.name, authorName));
      let authorId;
      if (authorRow.length > 0) {
        authorId = authorRow[0].id;
      } else {
        authorId = (await db.insert(authorsTable).values({ name: authorName }).returning())[0].id;
      }

      const data: typeof postsTable.$inferInsert = {
        title: post.title,
        description: post.description,
        content: post["content:encoded"],
        postUrl: post.link,
        imageUrl: post["media:content"]["@_url"],
        postedAt: new Date(post.pubDate),
        sourceId: rowId,
        authorId,
      };
      toInsert.push(data);
    }

    await db.insert(postsTable).values(toInsert);
    insertedSources = await db.update(sourcesTable).set({ checkedAt: new Date() }).returning();
  }

  const userData = [
    {
      id: "kx2rf9zPeM9zmZeFZ8Hq5m9ihIGo3q5b",
      name: "Anonymous",
      email: "temp-0jqkdjc4ilgekfln0k20un3mlvyfou2m@http://localhost:3000",
      emailVerified: false,
      image: null,
      createdAt: new Date(1760635635140),
      updatedAt: new Date(1760635635140),
      isAnonymous: true,
    },
  ];
  const sessionData = [
    {
      id: "fIf4Frw9jJdPNBs63S5y2dksG3cHgRUy",
      expiresAt: new Date(1761240435367),
      token: "KkgdTHhsUpIP99naC4fzjjbznhiNgCzY",
      createdAt: new Date(1760635635367),
      updatedAt: new Date(1760635635367),
      ipAddress: "127.0.0.1",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:143.0) Gecko/20100101 Firefox/143.0",
      userId: "kx2rf9zPeM9zmZeFZ8Hq5m9ihIGo3q5b",
    },
  ];

  await db.insert(user).values(userData);
  await db.insert(session).values(sessionData);

  const feed = await db
    .insert(feedsTable)
    .values({
      name: "main feed",
      userId: userData[0].id,
    })
    .returning();

  await db.insert(feedsToSources).values({
    feedId: feed[0].id,
    sourceId: insertedSources[0].id,
  });
})();
