import { ReactNode } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/shadcn/sidebar";

import { cookies } from "next/headers";
import { userInfoTypes } from "@/types/verifyOtpTypes";
import { getCookie } from "cookies-next/server";
import Header from "@/components/ui/foundations/header";
import Footer from "@/components/ui/foundations/footer";
import { AppSidebar } from "@/components/ui/sidebar/app-sidebar";

const DashboardLayout = async ({ children }: { children: ReactNode }) => {
  const userInfoFromCookie = await getCookie("userInfo", { cookies });
  const userInfo = userInfoFromCookie
    ? (JSON.parse(userInfoFromCookie) as userInfoTypes)
    : null;

  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          {userInfo && <Header userInfo={userInfo} />}
          <div className="flex flex-1 flex-col px-4 py-4 pb-0 gap-4 bg-gray-100/70 contain-inline-size">
            {children}
          </div>
          <Footer />
        </SidebarInset>
      </SidebarProvider>
    </>
  );
};

export default DashboardLayout;
