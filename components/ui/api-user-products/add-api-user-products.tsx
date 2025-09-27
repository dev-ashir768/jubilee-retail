"use client";

import { getRights } from "@/utils/getRights";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo } from "react";
import Empty from "../foundations/empty";
import SubNav from "../foundations/sub-nav";
import { Card, CardContent, CardHeader, CardTitle } from "../shadcn/card";
import { Button } from "../shadcn/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AddApiAserProductsForm from "./add-api-user-products-form";
import { useQuery } from "@tanstack/react-query";
import { fetchApiUserList } from "@/helperFunctions/userFunction";
import { ApiUsersResponseType } from "@/types/usersTypes";
import LoadingState from "../foundations/loading-state";
import Error from "../foundations/error";
import { ProductsResponseTypes } from "@/types/productsTypes";
import { fetchProductsList } from "@/helperFunctions/productsFunction";

const AddApiUserProducts = () => {
  // ======== CONSTANTS & HOOKS ========
  const LISTING_ROUTE = "/users/api-user-products";
  const router = useRouter();

  // ======== MEMOIZATION ========
  const rights = useMemo(() => {
    return getRights(LISTING_ROUTE);
  }, [LISTING_ROUTE]);

  // ======== DATA FETCHING ========
  const {
    data: apiUserListData,
    isLoading: apiUserListLoading,
    isError: apiUserListIsError,
    error: apiUserListError,
  } = useQuery<ApiUsersResponseType | null>({
    queryKey: ["api-user-products: api-user-list"],
    queryFn: fetchApiUserList,
  });

  const {
    data: productListData,
    isLoading: productListLoading,
    isError: productListIsError,
    error: productListError,
  } = useQuery<ProductsResponseTypes | null>({
    queryKey: ["api-user-products: products-list"],
    queryFn: fetchProductsList,
  });

  // ======== PAYLOADS DATA ========
  const apiUserList = useMemo(
    () => apiUserListData?.payload || [],
    [apiUserListData]
  );

   const productList = useMemo(
    () => productListData?.payload || [],
    [productListData]
  );

  // ======== RENDER LOGIC ========
  const isLoading = apiUserListLoading || productListLoading;
  const isError = apiUserListIsError || productListIsError;
  const onError = apiUserListError?.message || productListError?.message;

  useEffect(() => {
    if (rights && rights?.can_create === "0") {
      const timer = setTimeout(() => {
        router.push("/");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [rights, router]);

  if (isLoading) return <LoadingState />;
  if (isError) return <Error err={onError} />;

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
      <SubNav title="Add Api User Product" />

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
              Add a new api user product to the system
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full">
            <AddApiAserProductsForm apiUserList={apiUserList} productList={productList} />
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default AddApiUserProducts;
