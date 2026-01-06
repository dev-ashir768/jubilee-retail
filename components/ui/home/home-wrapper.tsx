"use client";

import React, { useEffect } from "react";
import { getRights } from "@/utils/getRights";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import Empty from "../foundations/empty";

const HomeWrapper = () => {
  const LISTING_ROUTE = "/dashboard";
  const router = useRouter();

  // ======== MEMOIZATION ========
  const rights = useMemo(() => {
    return getRights(LISTING_ROUTE);
  }, [LISTING_ROUTE]);

  // ======== RENDER LOGIC ========
  useEffect(() => {
    if (rights && rights?.can_view === "0") {
      const timer = setTimeout(() => {
        router.push("/");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [rights, router]);

  if (rights && rights?.can_view === "0")
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
