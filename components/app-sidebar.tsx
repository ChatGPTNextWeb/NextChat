"use client";

import * as React from "react";
import {
  AudioWaveform,
  Image,
  AudioLines,
  Command,
  GalleryVerticalEnd,
  SquarePen,
  MessageCircle,
} from "lucide-react";
import { Search as SearchIcon } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import Search from "./Search";
import { NavTabs } from "./nav-tabs";

// This is sample data.
const data = {
  user: {
    name: "john",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  // Main navigation tabs *************
  navMain: [
    {
      title: "Chat",
      url: "#",
      icon: SquarePen,
      isActive: true,
    },
    {
      title: "Voice",
      url: "#",
      icon: AudioLines,
    },
    {
      title: "Imagine",
      url: "#",
      icon: Image,
    },
    // {
    //   title: "Settings",
    //   url: "#",
    //   icon: Settings2,
    //   items: [
    //     {
    //       title: "General",
    //       url: "#",
    //     },
    //     {
    //       title: "Team",
    //       url: "#",
    //     },
    //     {
    //       title: "Billing",
    //       url: "#",
    //     },
    //     {
    //       title: "Limits",
    //       url: "#",
    //     },
    //   ],
    // },
  ],

  chats: [
    {
      title: "Chats",
      url: "#",
      icon: MessageCircle,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state, toggleSidebar } = useSidebar();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
        {state === "collapsed" && (
          <div className="mt-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              aria-label="Open search"
              title="Open search"
            >
              <SearchIcon />
              <span className="sr-only">Open search</span>
            </Button>
          </div>
        )}
      </SidebarHeader>
      <SidebarContent>
        {state !== "collapsed" && <Search />}
        {/* <NavMain items={data.navMain} /> */}
        <NavTabs label="Main Tabs" items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}

        {/* <NavMain items={data.navMain} /> */}
        <NavMain items={data.chats} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
