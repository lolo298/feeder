import { SourceWithPostsWithAuthor } from "@/types";
import { QueryFunctionContext } from "@tanstack/react-query";

export async function getSourceWithPostsWithAuthor({
  queryKey,
}: QueryFunctionContext): Promise<SourceWithPostsWithAuthor> {
  const [_key, sourceId] = queryKey;
  const res = await fetch(`/api/source/${sourceId}`);
  const json = await res.json();

  return json;
}
