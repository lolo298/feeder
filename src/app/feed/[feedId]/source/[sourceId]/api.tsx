import type { db } from "@/lib/db";
import { isServer } from "@tanstack/react-query";

export async function getSourcePosts({ queryKey }) {
  const [_key, sourceId] = queryKey;
  const res = await fetch(`/api/source/${sourceId}/posts`);
  const json = (await res.json()) as Awaited<ReturnType<typeof db.query.postsTable.findMany>>;

  return json;
}
