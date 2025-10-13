"use client";
import { Button } from "./ui/button";
import { Calendar, Wifi, Search, ChevronDown } from "lucide-react";
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
import { sourcesTable } from "@/db/schema";
import { Suspense, use } from "react";
import { Skeleton } from "./ui/skeleton";
import Link from "next/link";

type SidebarProps = {
  className: string;
};

function MainSidebar({
  feedsPromise,
}: {
  feedsPromise: Promise<(typeof sourcesTable.$inferSelect)[]>;
}) {
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon" className="transition-all">
      <SidebarHeader className={`flex-row ${open ? "justify-between" : "justify-end"}`}>
        {open && <div className="text-nowrap">Lorenzo Aoulini</div>}
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
                    <Feeds feedsPromise={feedsPromise} />
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

function Feeds({ feedsPromise }: { feedsPromise: Promise<(typeof sourcesTable.$inferSelect)[]> }) {
  const feedsData = use(feedsPromise);

  return (
    <Collapsible key="mainGroups">
      <CollapsibleTrigger asChild>
        <Button className="w-full justify-start" variant="ghost">
          <span>mainGroups</span>
          <ChevronDown />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="flex flex-col items-start pl-4">
        {feedsData.map((source) => {
          return (
            <Button variant="ghost" key={source.name} className="text-sm w-full justify-start">
              {source.name}
            </Button>
          );
        })}
      </CollapsibleContent>
    </Collapsible>
  );
}

export default MainSidebar;
