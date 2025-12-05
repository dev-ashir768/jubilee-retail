"use client";

import { getRights } from "@/utils/getRights";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import SubNav from "../foundations/sub-nav";
import { Card, CardContent, CardHeader, CardTitle } from "../shadcn/card";
import { Button } from "../shadcn/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AddProductCategoryForm from "./add-product-category-form";

const AddProductCategory = () => {
  // ======== CONSTANTS & HOOKS ========
  const LISTING_ROUTE = "/products-plans/product-category";
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  // ======== MEMOIZATION ========
  const rights = useMemo(() => {
    return getRights(LISTING_ROUTE);
  }, [LISTING_ROUTE]);

  // ======== RENDER LOGIC ========
  useEffect(() => {
    // Perform the check after the component mounts
    if (rights?.can_create === "1") {
      setIsAuthorized(true);
    } else if (rights) {
      router.replace(LISTING_ROUTE);
    }
  }, [rights, router, LISTING_ROUTE]);

  // ======== RENDER LOGIC ========
  if (!isAuthorized) {
    return null;
  }

  return (
    <>
      <SubNav title="Add Product Category" />

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
              Add a new product category to the system
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full">
            <AddProductCategoryForm />
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default AddProductCategory;
