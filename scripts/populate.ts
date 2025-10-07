import "dotenv/config";
import { authorsTable, postsTable, sourcesTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";
import { XMLParser } from "fast-xml-parser";

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
    await db.update(sourcesTable).set({ checkedAt: new Date() });
  }
})();
