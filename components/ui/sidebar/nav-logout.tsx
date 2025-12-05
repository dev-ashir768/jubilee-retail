"use client";

import { LogOut } from "lucide-react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/shadcn/sidebar";
import { handleLogout } from "@/utils/handleLogout";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const NavLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const handleQueryClear = () => {
    queryClient.clear();
    queryClient.getMutationCache().clear();
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="max-w-[150px] group-data-[collapsible=icon]:p-2! cursor-pointer"
          variant="logout"
          onClick={() => {
            handleLogout();
            handleQueryClear();
            router.replace("/login");
          }}
        >
          <LogOut className="!w-5 !h-5 group-data-[collapsible=icon]:!w-4 group-data-[collapsible=icon]:!h-4" />
          Logout
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default NavLogout;
