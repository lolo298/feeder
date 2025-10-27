import { feedsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getFeeds } from "@/lib/Feeds";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return new Response(null, { status: 401 });

  const data = await req.json();
  if (!data || !data.feedName) return new Response(null, { status: 400 });

  const insert = await db.insert(feedsTable).values({
    name: data.feedName,
    userId: session.user.id,
  });

  return new Response(null, { status: 200 });
}

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return new Response(null, { status: 401 });

  const feeds = (await getFeeds(session.user.id)) ?? [];
  return NextResponse.json(feeds);
}
