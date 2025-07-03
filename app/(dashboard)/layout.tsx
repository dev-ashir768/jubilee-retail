import { ReactNode } from "react"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/shadcn/sidebar"
import { AppSidebar } from "@/components/ui/sidebar/app-sidebar"

import { cookies } from "next/headers"
import { menusTypes, userInfoTypes } from "@/types/verifyOtpTypes"
import { getCookie } from "cookies-next/server"
import Header from "@/components/ui/foundations/header"
import Footer from "@/components/ui/foundations/footer"

const DashboardLayout = async ({ children }: { children: ReactNode }) => {
  const isMenus = await getCookie('menus', { cookies })
  const menusFromCookies = isMenus ? (JSON.parse(isMenus) as menusTypes[]) : []

  const userInfoFromCookie = await getCookie('userInfo', { cookies })
  const userInfo = userInfoFromCookie ? JSON.parse(userInfoFromCookie) as userInfoTypes : null

  return (
    <>
      <SidebarProvider>
        <AppSidebar menusFromCookies={menusFromCookies} />
        <SidebarInset>
          {userInfo && <Header userInfo={userInfo} />}
          <div className="flex flex-1 flex-col gap-4 p-4 bg-gray-50">
            {children}
          </div>
          <Footer />
        </SidebarInset>
      </SidebarProvider>

    </>
  )
}

export default DashboardLayout