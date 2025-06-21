"use client"

import { LogOut } from "lucide-react"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/shadcn/sidebar"
import Link from "next/link"

const NavLogout = () => {

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" className="max-w-[150px] group-data-[collapsible=icon]:p-2!" variant="logout" asChild>
          <Link href="/">
            <LogOut className="!w-5 !h-5 group-data-[collapsible=icon]:!w-4 group-data-[collapsible=icon]:!h-4" />
            Logout
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export default NavLogout