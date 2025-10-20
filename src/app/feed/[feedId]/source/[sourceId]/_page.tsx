"use client";
import { useQuery } from "@tanstack/react-query";
import { getSourcePosts } from "./api";

function Source({ params }: { params: { feedId: string; sourceId: string } }) {
  const { feedId, sourceId } = params;
  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["sourcePosts", sourceId],
    queryFn: getSourcePosts,
  });
  console.log(`data: `, isLoading, data);

  if (isLoading) return <p>Loading ...</p>;
  if (isError || !isSuccess) return <p>Error</p>;

  return (
    <div>
      <p>
        {feedId} - {sourceId}
      </p>
      <div>
        {data.map((post) => (
          <p>{post.title}</p>
        ))}
      </div>
    </div>
  );
}

export default Source;
