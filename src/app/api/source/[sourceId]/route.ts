import { postsTable, sourcesTable } from "@/db/schema";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ sourceId: string }> }) {
  const { sourceId } = await params;
  console.log("source: ", sourceId);

  const data = await db.query.sourcesTable.findFirst({
    where: eq(sourcesTable.id, sourceId),
    with: {
      posts: {
        with: {
          author: true,
        },
      },
    },
  });

  return NextResponse.json(data);
}
