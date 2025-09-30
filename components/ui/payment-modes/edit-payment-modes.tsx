"use client";
import React, { useEffect, useMemo } from "react";
import SubNav from "../foundations/sub-nav";
import { Card, CardContent, CardHeader, CardTitle } from "../shadcn/card";
import { Button } from "../shadcn/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import EditPaymentModeForm from "./edit-payment-modes-form";
import { getRights } from "@/utils/getRights";
import Empty from "../foundations/empty";
import { useQuery } from "@tanstack/react-query";
import { PaymentModesResponseType } from "@/types/paymentModesTypes";
import usePaymentModesIdStore from "@/hooks/paymentModesIdStore";
import { fetchSinglePaymentModesList } from "@/helperFunctions/paymentModesFunction";
import LoadingState from "../foundations/loading-state";
import Error from "../foundations/error";

const EditPaymentModes = () => {
  // ======== CONSTANTS & HOOKS ========
  const LISTING_ROUTE = "/products-plans/payment-modes";
  const { paymentModesId } = usePaymentModesIdStore();
  const router = useRouter();

  // ======== MEMOIZATION ========
  const rights = useMemo(() => {
    return getRights(LISTING_ROUTE);
  }, [LISTING_ROUTE]);

  // ======== DATA FETCHING ========
  const {
    data: singlePaymentModeResponse,
    isLoading: singlePaymentModeLoading,
    isError: singlePaymentModeIsError,
    error: singlePaymentModeError,
  } = useQuery<PaymentModesResponseType | null>({
    queryKey: ["single-payment-mode", paymentModesId],
    queryFn: () => fetchSinglePaymentModesList(paymentModesId!),
    enabled: !!paymentModesId,
  });

  // ======== PAYLOADS DATA ========
  const singlePaymentMode = singlePaymentModeResponse?.payload || [];

  // ======== RENDER LOGIC ========
  useEffect(() => {
    if (rights && rights?.can_edit === "0") {
      const timer = setTimeout(() => {
        router.push("/");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [rights, router]);

  const isLoading = singlePaymentModeLoading;
  const isError = singlePaymentModeIsError;
  const onError = singlePaymentModeError?.message;

  if (isLoading) return <LoadingState />;
  if (isError) return <Error err={onError} />;
  if (!paymentModesId)
    return (
      <Empty
        title="Permission Denied"
        description="You do not have permission."
      />
    );

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
      <SubNav title="Edit Payment Mode" />

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
              Edit a payment mode in the system
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full">
            <EditPaymentModeForm singlePaymentMode={singlePaymentMode} />
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default EditPaymentModes;
