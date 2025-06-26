import { ReactNode } from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/shadcn/breadcrumb"
import { Separator } from "@/components/ui/shadcn/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/shadcn/sidebar"
import { AppSidebar } from "@/components/ui/foundations/sidebar/app-sidebar"
import UserProfile from "@/components/ui/foundations/sidebar/user-profile"

import { cookies } from "next/headers"
import { menusTypes } from "@/types/verifyOtpTypes"
import { getCookie } from "cookies-next/server"

const DashboardLayout = async ({ children }: { children: ReactNode }) => {

  const menusFromCookies = await getCookie('menus', { cookies })
  const initialMenus = menusFromCookies ? (JSON.parse(menusFromCookies) as menusTypes[]) : []
  
  return (
    <>
      <SidebarProvider>
        <AppSidebar initialMenus={initialMenus} />
        <SidebarInset>
          <header className="flex border-b h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">
                      Building Your Application
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <UserProfile />
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0 bg-gray-50">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>

    </>
  )
}

export default DashboardLayout