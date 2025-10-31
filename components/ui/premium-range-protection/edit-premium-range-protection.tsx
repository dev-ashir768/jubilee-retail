"use client";

import React, { useEffect, useMemo } from "react";
import SubNav from "../foundations/sub-nav";
import { Card, CardContent, CardHeader, CardTitle } from "../shadcn/card";
import { Button } from "../shadcn/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { getRights } from "@/utils/getRights";
import Empty from "../foundations/empty";
import EditPremiumRangeProtectionForm from "./edit-premium-range-protection-form";
import { useQuery } from "@tanstack/react-query";
import { ApiUsersResponseType } from "@/types/usersTypes";
import { fetchAllApiUserList } from "@/helperFunctions/userFunction";
import LoadingState from "../foundations/loading-state";
import Error from "../foundations/error";
import usePremiumRangeProtectionIdStore from "@/hooks/premiumRangeProtectionIdStore";
import { fetchSinglePremiumRangeProtectionsList } from "@/helperFunctions/premiumRangeProtectionsFunction";
import { PremiumRangeProtectionsResponseType } from "@/types/premiumRangeProtectionsTypes";

const EditPremiumRangeProtection = () => {
  // ======== CONSTANTS & HOOKS ========
  const LISTING_ROUTE = "/products-plans/premium-range-protection";
  const { premiumRangeProtectionId } = usePremiumRangeProtectionIdStore();
  const router = useRouter();

  // ======== MEMOIZATION ========
  const rights = useMemo(() => {
    return getRights(LISTING_ROUTE);
  }, [LISTING_ROUTE]);

  // ======== DATA FETCHING ========
  const {
    data: apiUserListResponse,
    isLoading: apiUserListLoading,
    isError: apiUserListIsError,
    error: apiUserListError,
  } = useQuery<ApiUsersResponseType | null>({
    queryKey: ["all-api-user-list"],
queryFn: fetchAllApiUserList,
  });

  const {
    data: singlePremiumRangeProtectionResponse,
    isLoading: singlePremiumRangeProtectionLoading,
    isError: singlePremiumRangeProtectionIsError,
    error: singlePremiumRangeProtectionError,
  } = useQuery<PremiumRangeProtectionsResponseType | null>({
    queryKey: ["single-premium-range-protection", premiumRangeProtectionId],
    queryFn: () =>
      fetchSinglePremiumRangeProtectionsList(premiumRangeProtectionId!),
    enabled: !!premiumRangeProtectionId,
  });

  // ======== PAYLOADS DATA ========
  const apiUserList = apiUserListResponse?.payload || [];
  const singlePremiumRangeProtection =
    singlePremiumRangeProtectionResponse?.payload || [];

  // ======== RENDER LOGIC ========
  useEffect(() => {
    if (rights && rights?.can_edit === "0") {
      const timer = setTimeout(() => {
        router.push("/");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [rights, router]);

  const isLoading = apiUserListLoading || singlePremiumRangeProtectionLoading;
  const isError = apiUserListIsError || singlePremiumRangeProtectionIsError;
  const onError =
    apiUserListError?.message || singlePremiumRangeProtectionError?.message;

  if (isLoading) return <LoadingState />;
  if (isError) return <Error err={onError} />;

  if (rights && rights?.can_edit === "0") {
    return (
      <Empty
        title="Permission Denied"
        description="You do not have permission."
      />
    );
  }

  return (
    <>
      <SubNav title="Edit Premium Range" />

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
              Edit a premium range to the system
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full">
            <EditPremiumRangeProtectionForm
              apiUserList={apiUserList}
              singlePremiumRangeProtection={singlePremiumRangeProtection}
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default EditPremiumRangeProtection;
