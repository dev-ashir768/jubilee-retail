"use client";

import React, { useEffect, useMemo } from "react";
import SubNav from "../foundations/sub-nav";
import { Card, CardContent, CardHeader, CardTitle } from "../shadcn/card";
import { Button } from "../shadcn/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AddPlanForm from "./add-plan-form";
import { useRouter } from "next/navigation";
import { getRights } from "@/utils/getRights";
import Empty from "../foundations/empty";

const AddPlan = () => {
  
  // ======== CONSTANTS & HOOKS ========
  const LISTING_ROUTE = "/products-plans/plan";
  const router = useRouter();

  // ======== MEMOIZATION ========
  const rights = useMemo(() => {
    return getRights(LISTING_ROUTE);
  }, [LISTING_ROUTE]);

  // ======== RENDER LOGIC ========
  useEffect(() => {
    if (rights && rights?.can_create === "0") {
      const timer = setTimeout(() => {
        router.push("/");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [rights, router]);

  if (rights && rights?.can_create === "0") {
    return (
      <Empty
        title="Permission Denied"
        description="You do not have permission."
      />
    );
  }

  return (
    <>
      <SubNav title="Add Plan" />

      <Card className="w-full shadow-none border-none">
        <CardHeader className="border-b gap-0">
          <CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full border border-gray-200"
                asChild
              >
                <Link href={LISTING_ROUTE}>
                  <ArrowLeft className="size-6" />
                </Link>
              </Button>
              Add a new plan to the system
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full">
            <AddPlanForm />
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default AddPlan;
