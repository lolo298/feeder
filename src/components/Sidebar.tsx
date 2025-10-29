"use client";
import { Button } from "./ui/button";
import {
  Calendar,
  Wifi,
  Search,
  ChevronDown,
  ChevronRight,
  Plus,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "./ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { feedsTable, sourcesTable } from "@/db/schema";
import { memo, ReactNode, Suspense, use, useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import Link from "next/link";
import { authClient, Session } from "@/lib/auth-client";
import type { getFeeds as getFeedsType } from "@/lib/Feeds";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "./ui/dialog";
import { DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  useMutation,
  useMutationState,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

type FeedsResults = NonNullable<Awaited<ReturnType<typeof getFeedsType>>>;

const getFeeds = async () => {
  const res = await fetch("/api/feed");
  const data = await res.json();
  return data as FeedsResults;
};

function MainSidebar() {
  const { open } = useSidebar();
  const { data: session } = authClient.useSession();
  console.log("rendering sidebar");
  const { data, isLoading } = useQuery({
    queryKey: ["feeds"],
    queryFn: getFeeds,
  });

  return (
    <Sidebar collapsible="icon" className="transition-all">
      <SidebarHeader
        className={`flex-row ${open ? "justify-between" : "justify-end"}`}
      >
        {open && (
          <Button variant="ghost" className="flex-1" asChild>
            {session?.user ? (
              <span>{session.user.name}</span>
            ) : (
              <Link href="/auth">Login</Link>
            )}
          </Button>
        )}
        <SidebarTrigger />
      </SidebarHeader>
      {open && (
        <SidebarContent>
          <SidebarGroup>
            <Button variant="ghost" className="justify-start" asChild>
              <Link href="/today">
                <Calendar /> Today
              </Link>
            </Button>
            <Button variant="ghost" className="justify-start">
              <Wifi /> Source
            </Button>
            <Button variant="ghost" className="justify-start">
              <Search /> Search
            </Button>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel className="flex flex-row justify-between">
              <span>Feeds</span>
              <NewFeed>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Plus />
                  </Button>
                </DialogTrigger>
              </NewFeed>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  {isLoading ? (
                    <Skeleton className="h-9 px-4 py-2" />
                  ) : (
                    data?.map((feed) => (
                      <Feeds key={feed.id + feed.name} feed={feed} />
                    ))
                  )}
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      )}
    </Sidebar>
  );
}

function Feeds({ feed }: { feed: FeedsResults[number] }) {
  const [open, setOpen] = useState<boolean>();

  const isOptimistic = feed.id === "";

  if (isOptimistic) {
    return <Skeleton className="h-9 px-4 py-2" />;
  }

  return (
    <Collapsible onOpenChange={(open) => setOpen(open)}>
      <Button className="w-full justify-start p-0" variant="ghost" asChild>
        <div>
          <CollapsibleTrigger className="h-full aspect-square flex justify-center items-center cursor-pointer py-2">
            <ChevronRight
              style={{
                transition: "transform .2s ease-in-out",
                transform: `rotate(${open ? "90deg" : "0deg"})`,
              }}
            />
          </CollapsibleTrigger>
          <Link href={`/feed/${feed.id}`} className="flex-1 py-2">
            {feed.name}
          </Link>
        </div>
      </Button>
      <CollapsibleContent className="flex flex-col items-start pl-4">
        {feed.feedsToSources.map(({ source }) => {
          return (
            <Button
              variant="ghost"
              key={source.name}
              className="text-sm w-full justify-start"
              asChild
            >
              <Link href={`/feed/${feed.id}/source/${source.id}`}>
                {source.name}
              </Link>
            </Button>
          );
        })}
      </CollapsibleContent>
    </Collapsible>
  );
}

function NewFeed({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();

  const mutation = useMutation({
    mutationFn: async ({ feedName }: { feedName: string }) => {
      return fetch("/api/feed", {
        method: "post",
        body: JSON.stringify({ feedName }),
      });
    },

    mutationKey: ["addFeed"],

    async onMutate(newFeed, context) {
      await context.client.cancelQueries({ queryKey: ["feeds"] });
      const previousFeeds = context.client.getQueryData(["feeds"]);

      context.client.setQueryData<FeedsResults>(["feeds"], (old) => [
        ...(old || []),
        {
          id: "",
          name: newFeed.feedName,
          userId: session?.user.id || "",
          feedsToSources: [],
        },
      ]);
      return { previousFeeds };
    },

    onError(_error, _variables, onMutateResult, context) {
      context.client.setQueryData(["todos"], onMutateResult?.previousFeeds);
    },

    onSettled() {
      queryClient.invalidateQueries({ queryKey: ["feeds"] });
    },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const feedName = formData.get("feedName")?.toString() ?? "";
    mutation.mutate({ feedName });
  }

  if (mutation.isPending) return <div>Loading ...</div>;

  return (
    <Dialog>
      {children}
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create a new feed</DialogTitle>
          </DialogHeader>
          <div>
            <Label htmlFor="feedName">Feed name</Label>
            <Input id="feedName" name="feedName" type="text" />
          </div>
          <DialogFooter>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default MainSidebar;
