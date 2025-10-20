import { dehydrate, HydrationBoundary, isServer, QueryClient } from "@tanstack/react-query";
import Source from "./_page";
import { getSourcePosts } from "./api";

async function ServerSource({
  params: serverParams,
}: {
  params: Promise<{ feedId: string; sourceId: string }>;
}) {
  const params = await serverParams;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["sourcePosts", params.sourceId],
    queryFn: getSourcePosts,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Source params={params} />
    </HydrationBoundary>
  );
}

export default ServerSource;
