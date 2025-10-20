import { postsTable } from "@/db/schema";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ sourceId: string }> }) {
  const { sourceId } = await params;
  console.log("source: ", sourceId);

  const data = await db.query.postsTable.findMany({
    where: eq(postsTable.sourceId, sourceId),
    limit: 10,
  });

  return NextResponse.json(data);
}
