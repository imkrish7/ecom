"use client";

import * as React from "react";

import { NavUser } from "@/components/layout/private/nav-user";
import {
  Sidebar,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarContent,
} from "@/components/ui/sidebar";
import { LayoutDashboard, List } from "lucide-react";
import { NavMain } from "./nav-main";
import { useAuth } from "@/context/authContext";

const data = {
  navMain: {
    admin: [
      {
        title: "Dashboard",
        url: "/admin/dashboard",
        icon: LayoutDashboard,
      },
    ],
    user: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Orders",
        url: "/orders",
        icon: List,
      },
    ],
  },
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const auth = useAuth();
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={`data-[slot=sidebar-menu-button]:p-1.5!`}
            >
              <a href="#">
                <span className="text-base font-semibold">Acme Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {auth.user && (
          <NavMain
            items={data.navMain[auth.user.role == "user" ? "user" : "admin"]}
          />
        )}
      </SidebarContent>
      <SidebarFooter>{auth.user && <NavUser user={auth.user} />}</SidebarFooter>
    </Sidebar>
  );
}
