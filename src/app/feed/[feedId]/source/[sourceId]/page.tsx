import { dehydrate, HydrationBoundary, isServer, QueryClient } from "@tanstack/react-query";
import Source from "./_page";
import { getSourceWithPostsWithAuthor } from "./api";

async function ServerSource({
  params: serverParams,
}: {
  params: Promise<{ feedId: string; sourceId: string }>;
}) {
  const params = await serverParams;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["source", params.sourceId],
    queryFn: getSourceWithPostsWithAuthor,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Source params={params} />
    </HydrationBoundary>
  );
}

export default ServerSource;
