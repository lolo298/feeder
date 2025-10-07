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

type SidebarProps = {
  className: string;
};

function MainSidebar({ className }: SidebarProps) {
  const feeds = [
    {
      groupName: "AI",
      sources: [{ name: "medium.com" }, { name: "bytes.dev" }, { name: "dev.to" }],
    },
    {
      groupName: "Webdev",
      sources: [{ name: "medium.com" }, { name: "bytes.dev" }, { name: "dev.to" }],
    },
  ];

  return <Content feeds={feeds} />;
}

function Content({ feeds }: { feeds: { groupName: string; sources: { name: string }[] }[] }) {
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
            <Button variant="ghost" className="justify-start">
              <Calendar /> Today
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
                  {feeds.map((feed) => {
                    return (
                      <Collapsible key={feed.groupName}>
                        <CollapsibleTrigger asChild>
                          <Button className="w-full justify-start" variant="ghost">
                            <span>{feed.groupName}</span>
                            <ChevronDown />
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="flex flex-col items-start pl-4">
                          {feed.sources.map((source) => {
                            return (
                              <Button
                                variant="ghost"
                                key={source.name}
                                className="text-sm w-full justify-start"
                              >
                                {source.name}
                              </Button>
                            );
                          })}
                        </CollapsibleContent>
                      </Collapsible>
                    );
                  })}
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      )}
    </Sidebar>
  );
}

export default MainSidebar;
