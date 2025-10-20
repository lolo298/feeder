"use client";
import { Button } from "./ui/button";
import { Calendar, Wifi, Search, ChevronDown, ChevronRight } from "lucide-react";
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { feedsTable, sourcesTable } from "@/db/schema";
import { Suspense, use, useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import Link from "next/link";
import { authClient, Session } from "@/lib/auth-client";
import { InferSelectModel } from "drizzle-orm";
import type { getFeeds } from "@/lib/Feeds";

function MainSidebar({ feedsPromise }: { feedsPromise: ReturnType<typeof getFeeds> }) {
  const { open } = useSidebar();
  const { data } = authClient.useSession();
  const feeds = use(feedsPromise);

  return (
    <Sidebar collapsible="icon" className="transition-all">
      <SidebarHeader className={`flex-row ${open ? "justify-between" : "justify-end"}`}>
        {open && (
          <Button variant="ghost" className="flex-1" asChild>
            {data?.user ? <span>{data.user.name}</span> : <Link href="/auth">Login</Link>}
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
            <SidebarGroupLabel>Feeds</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <Suspense fallback={<Skeleton className="h-9 px-4 py-2" />}>
                    {feeds?.map((feed) => (
                      <Feeds key={feed.id} feed={feed} />
                    ))}
                  </Suspense>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      )}
    </Sidebar>
  );
}

function Feeds({ feed }: { feed: NonNullable<Awaited<ReturnType<typeof getFeeds>>>[number] }) {
  const [open, setOpen] = useState<boolean>();
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
              <Link href={`/feed/${feed.id}/source/${source.id}`}>{source.name}</Link>
            </Button>
          );
        })}
      </CollapsibleContent>
    </Collapsible>
  );
}

export default MainSidebar;
