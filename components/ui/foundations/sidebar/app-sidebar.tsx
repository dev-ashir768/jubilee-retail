"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

import NavLogo from "@/components/ui/foundations/sidebar/nav-logo"
import NavMain from "@/components/ui/foundations/sidebar/nav-main"
import NavLogout from "@/components/ui/foundations/sidebar/nav-logout"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/shadcn/sidebar"
import { menusTypes } from "@/types/verifyOtpTypes"
import { getCookie } from "cookies-next"



export function AppSidebar({ initialMenus = [], ...props }: { initialMenus?: menusTypes[] } & React.ComponentProps<typeof Sidebar>) {

  const [menus, setMenus] = useState<menusTypes[]>(initialMenus)

  useEffect(() => {
    if (menus.length === 0) {
      const menusFromCookies = getCookie('menus')?.toString()
      const cookiesMenus = menusFromCookies ? (JSON.parse(menusFromCookies) as menusTypes[]) : []
      setMenus(cookiesMenus)
    }
  }, [menus.length])

  const organizeMenu = useCallback((menus: menusTypes[]) => {
    // Add items array to each menu item
    const menusWithChildren = menus.map(item => ({ ...item, items: [] as menusTypes[] }));

    // Separate top-level items and children
    const result: menusTypes[] = [];
    menusWithChildren.forEach((item: menusTypes) => {
      if (!item.parent_id) {
        result.push(item);
      } else {
        const parent = menusWithChildren.find(p => p.menu_id === item.parent_id);
        if (parent) parent.items.push(item);
      }
    });

    // Sort top-level items and their children by sorting field
    result.sort((a, b) => a.sorting - b.sorting);
    result.forEach(parent => parent.items!.sort((a, b) => a.sorting - b.sorting));

    return result;
  }, []);

  const cacheMenu = useMemo(() => organizeMenu(menus), [menus, organizeMenu])

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-b">
        <NavLogo />
      </SidebarHeader>
      <SidebarContent>
        <NavMain menusData={cacheMenu} />
      </SidebarContent>
      <SidebarFooter className="border-t">
        <NavLogout />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
