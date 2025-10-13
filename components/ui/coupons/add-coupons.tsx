"use client";

import React, { useMemo } from "react";
import SubNav from "../foundations/sub-nav";
import { Card, CardContent, CardHeader, CardTitle } from "../shadcn/card";
import { Button } from "../shadcn/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AddCouponsForm from "./add-coupons-form";
import Empty from "../foundations/empty";
import LoadingState from "../foundations/loading-state";
import Error from "../foundations/error";
import { useQuery } from "@tanstack/react-query";
import { getRights } from "@/utils/getRights";
import { fetchProductsList } from "@/helperFunctions/productsFunction";
import { ProductsResponseTypes } from "@/types/productsTypes";

const AddCoupons = () => {
  // ======== CONSTANTS & HOOKS ========
  const LISTING_ROUTE = "/coupons-management/coupons";

  // ======== MEMOIZATION ========
  const rights = useMemo(() => {
    return getRights(LISTING_ROUTE);
  }, [LISTING_ROUTE]);

  // ======== DATA FETCHING ========
  const {
    data: productListResponse,
    isLoading: productListLoading,
    isError: productListIsError,
    error: productListError,
  } = useQuery<ProductsResponseTypes | null>({
    queryKey: ["products-list"],
    queryFn: fetchProductsList,
  });

  // ======== PAYLOADS DATA ========
  const productList = productListResponse?.payload || [];

  // ======== RENDER LOGIC ========
  const isLoading = productListLoading;
  const isError = productListIsError;
  const onError = productListError?.message;

  if (isLoading) return <LoadingState />;
  if (isError) return <Error err={onError} />;
  if (rights?.can_create == "0")
    return (
      <Empty
        title="Permission Denied"
        description="You do not have permission."
      />
    );

  return (
    <>
      <SubNav title="Add Coupons" />

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
              Add a new coupons to the system
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full">
            <AddCouponsForm productList={productList} />
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default AddCoupons;
