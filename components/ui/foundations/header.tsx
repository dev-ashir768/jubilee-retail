"use client";

import React from "react";
import { SidebarTrigger } from "../shadcn/sidebar";
import { Separator } from "../shadcn/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../shadcn/breadcrumb";
import UserProfile from "../sidebar/user-profile";
import { userInfoTypes } from "@/types/verifyOtpTypes";
import { usePathname } from "next/navigation";


interface HeaderProps {
  userInfo: userInfoTypes;
}

const Header: React.FC<HeaderProps> = ({ userInfo }) => {
  const pathname = usePathname();
  const currentModule = pathname.split("/");

  return (
    <>
      <header className="flex border-b h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 px-4 sticky z-50 top-0 bg-[#1a2226]">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1 text-white" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/" className="text-white/80">Home</BreadcrumbLink>
              </BreadcrumbItem>
              {currentModule?.[2] && (
                <>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="capitalize text-white">
                      {currentModule[2]?.replace("-", " ")}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <UserProfile userInfo={userInfo} />
      </header>
    </>
  );
};

export default Header;
