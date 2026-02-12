"use client";

import React, { useEffect } from "react";
import { getRights } from "@/utils/getRights";
import { useMemo } from "react";
import { redirect } from "next/navigation";
import Empty from "../foundations/empty";
import { getUserInfo } from "@/utils/getUserInfo";

const HomeWrapper = () => {
  const LISTING_ROUTE = "/dashboard";
  const userInfo = getUserInfo();

  // ======== MEMOIZATION ========
  const rights = useMemo(() => {
    return getRights(LISTING_ROUTE);
  }, [LISTING_ROUTE]);

  // ======== RENDER LOGIC ========
  useEffect(() => {
    if ((rights && rights?.can_view === "0") || !rights?.can_view) {
      const timer = setTimeout(() => {
        redirect(userInfo?.redirection_url ? userInfo.redirection_url : "/");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [rights, userInfo]);

  if ((rights && rights?.can_view === "0") || !rights?.can_view)
    return (
      <Empty
        title="Permission Denied"
        description="You do not have permission."
      />
    );

  return (
    <div className="w-full h-full flex justify-center items-center">
      <h1 className="text-gray-600 text-3xl tracking-wide">
        Welcome to Jubilee General Retail
      </h1>
    </div>
  );
};

export default HomeWrapper;
