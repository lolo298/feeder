"use client";
import { useQuery } from "@tanstack/react-query";
import { getSourceWithPostsWithAuthor } from "./api";
import CardView from "@/components/views/CardView";
import { Separator } from "@/components/ui/separator";

function Source({ params }: { params: { feedId: string; sourceId: string } }) {
  const { feedId, sourceId } = params;
  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["source", sourceId],
    queryFn: getSourceWithPostsWithAuthor,
  });
  console.log(`data: `, isLoading, data);

  if (isLoading) return <p>Loading ...</p>;
  if (isError || !isSuccess) return <p>Error</p>;

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1">
        <div className="flex p-4">
          <h1 className="font-bold text-4xl px-6">{data.name}</h1>
        </div>
        <Separator />
        <div className="h-64"></div>
        <div className="flex justify-center">
          <CardView posts={data.posts} />
        </div>
      </div>
    </div>
  );
}

export default Source;
