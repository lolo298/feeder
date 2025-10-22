import { cn } from "@/lib/utils";
import { PostWithAuthor } from "@/types";
import { Wifi } from "lucide-react";

function CardView({ posts, className }: { posts: PostWithAuthor[]; className?: string }) {
  return (
    <div className="grid grid-flow-row grid-cols-[repeat(3,17rem)] gap-x-4 gap-y-16">
      {posts.map((post) => (
        <Card post={post} key={post.id} />
      ))}
    </div>
  );
}

function Card({ post }: { post: PostWithAuthor }) {
  return (
    <div className="w-full flex flex-col cursor-pointer">
      <div className="w-full aspect-[25/18] rounded-md overflow-hidden hover:brightness-50 transition-[filter]">
        {post.imageUrl ? (
          <img className="size-full object-cover" src={post.imageUrl} alt={post.title} />
        ) : (
          <div className="size-full bg-card flex justify-center items-center">
            <Wifi size={32} />
          </div>
        )}
      </div>
      <div className="font-bold line-clamp-2">{post.title}</div>
      <div className="text-sm font-normal text-secondary">by {post.author.name}</div>
      <div className="text-sm font-normal text-secondary line-clamp-3">{post.description}</div>
    </div>
  );
}

export default CardView;
