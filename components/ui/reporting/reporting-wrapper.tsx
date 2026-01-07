"use client";

import React, { useEffect, useMemo } from "react";
import { AgentResponseTypes } from "@/types/agentTypes";

import { useMutation, useQuery } from "@tanstack/react-query";
import ReportingForm from "./reporting-form";
import LoadingState from "../foundations/loading-state";
import Error from "../foundations/error";
import { BranchResponseType } from "@/types/branchTypes";
import { fetchAllBranchList } from "@/helperFunctions/branchFunction";
import { ClientResponseType } from "@/types/clientTypes";
import { fetchAllClientList } from "@/helperFunctions/clientFunction";
import { DevelopmentOfficerResponseTypes } from "@/types/developmentOfficerTypes";
import { fetchAllDevelopmentOfficerList } from "@/helperFunctions/developmentOfficerFunction";
import { ProductsResponseTypes } from "@/types/productsTypes";
import { PlanResponseTypes } from "@/types/planTypes";
import { fetchPlansList } from "@/helperFunctions/plansFunction";
import { fetchAllApiUserList } from "@/helperFunctions/userFunction";
import { ApiUsersResponseType } from "@/types/usersTypes";
import { Card, CardContent, CardHeader, CardTitle } from "../shadcn/card";
import { CityResponseType } from "@/types/cityTypes";
import { fetchCityList } from "@/helperFunctions/cityFunction";
import { CouponsResponseType } from "@/types/couponsTypes";
import { fetchAllProductsList } from "@/helperFunctions/productsFunction";
import { fetchAllAgentList } from "@/helperFunctions/agentFunction";
import { fetchAllCouponsList } from "@/helperFunctions/couponsFunction";
import { getRights } from "@/utils/getRights";
import { useRouter } from "next/navigation";
import Empty from "../foundations/empty";
import { Button } from "../shadcn/button";
import { downloadMIS } from "@/helperFunctions/downloadMICFunction";
import { toast } from "sonner";
import { Loader } from "lucide-react";

const ReportingWrapper = () => {
  // ======== CONSTANTS & HOOKS ========
  const LISTING_ROUTE = "/reporting";
  const router = useRouter();

  // ======== MEMOIZATION ========
  const rights = useMemo(() => {
    return getRights(LISTING_ROUTE);
  }, [LISTING_ROUTE]);

  // ======== DATA FETCHING ========
  const {
    data: agentListResponse,
    isLoading: agentListLoading,
    isError: agentListIsError,
    error: agentListError,
  } = useQuery<AgentResponseTypes | null>({
    queryKey: ["all-agents-list"],
    queryFn: fetchAllAgentList,
  });

  const {
    data: branchListResponse,
    isLoading: branchListLoading,
    isError: branchListIsError,
    error: branchListError,
  } = useQuery<BranchResponseType | null>({
    queryKey: ["all-branch-list"],
    queryFn: fetchAllBranchList,
  });

  const {
    data: clientListResponse,
    isLoading: clientListLoading,
    isError: clientListIsError,
    error: clientListError,
  } = useQuery<ClientResponseType | null>({
    queryKey: ["all-client-list"],
    queryFn: fetchAllClientList,
  });

  const {
    data: doListResponse,
    isLoading: doListLoading,
    isError: doListIsError,
    error: doListError,
  } = useQuery<DevelopmentOfficerResponseTypes | null>({
    queryKey: ["all-development-officers-list"],
    queryFn: fetchAllDevelopmentOfficerList,
  });

  const {
    data: productListResponse,
    isLoading: productListLoading,
    isError: productListIsError,
    error: productListError,
  } = useQuery<ProductsResponseTypes | null>({
    queryKey: ["all-products-list"],
    queryFn: fetchAllProductsList,
  });

  const {
    data: planListResponse,
    isLoading: planListLoading,
    isError: planListIsError,
    error: planListError,
  } = useQuery<PlanResponseTypes | null>({
    queryKey: ["plans-list"],
    queryFn: fetchPlansList,
  });

  const {
    data: cityListResponse,
    isLoading: cityListLoading,
    isError: cityListIsError,
    error: cityListError,
  } = useQuery<CityResponseType | null>({
    queryKey: ["city-list"],
    queryFn: fetchCityList,
  });

  const {
    data: couponListResponse,
    isLoading: couponListLoading,
    isError: couponListIsError,
    error: couponListError,
  } = useQuery<CouponsResponseType | null>({
    queryKey: ["all-coupons-list"],
    queryFn: fetchAllCouponsList,
  });

  const {
    data: apiUsersListResponse,
    isLoading: apiUsersListLoading,
    isError: apiUsersListIsError,
    error: apiUsersListError,
  } = useQuery<ApiUsersResponseType | null>({
    queryKey: ["all-api-user-list"],
    queryFn: fetchAllApiUserList,
  });

  // ======== MUTATION ========
  const downloadMISMutation = useMutation({
    mutationFn: downloadMIS,
    onSuccess: (data) => {
      const blob = new Blob([data], { type: "application/zip" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "MIS_Report.xlsx");

      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("MIS downloaded successfully");
    },
    onError: (err) => {
      const message = err?.message;
      console.log("Add agent mutation error", err);
      toast.error(message);
    },
  });

  // ======== PAYLOADS DATA ========
  const couponList = useMemo(
    () => couponListResponse?.payload || [],
    [couponListResponse]
  );

  const agentList = useMemo(
    () => agentListResponse?.payload || [],
    [agentListResponse]
  );

  const branchList = useMemo(
    () => branchListResponse?.payload || [],
    [branchListResponse]
  );

  const productList = useMemo(
    () => productListResponse?.payload || [],
    [productListResponse]
  );

  const clientList = useMemo(
    () => clientListResponse?.payload || [],
    [clientListResponse]
  );

  const doList = useMemo(() => doListResponse?.payload || [], [doListResponse]);

  const planList = useMemo(
    () => planListResponse?.payload || [],
    [planListResponse]
  );

  const apiUsersList = useMemo(
    () => apiUsersListResponse?.payload || [],
    [apiUsersListResponse]
  );

  const cityList = useMemo(
    () => cityListResponse?.payload || [],
    [cityListResponse]
  );

  // ======== RENDER LOGIC ========
  const isLoading =
    agentListLoading ||
    planListLoading ||
    apiUsersListLoading ||
    productListLoading ||
    doListLoading ||
    clientListLoading ||
    couponListLoading ||
    cityListLoading ||
    branchListLoading;
  const isError =
    agentListIsError ||
    apiUsersListIsError ||
    planListIsError ||
    productListIsError ||
    couponListIsError ||
    doListIsError ||
    clientListIsError ||
    cityListIsError ||
    branchListIsError;
  const onError =
    agentListError?.message ||
    apiUsersListError?.message ||
    planListError?.message ||
    productListError?.message ||
    clientListError?.message ||
    branchListError?.message ||
    cityListError?.message ||
    doListError?.message ||
    couponListError?.message;

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

  const renderPageContent = () => {
    if (isLoading) {
      return <LoadingState />;
    }

    if (isError) {
      return <Error err={onError} />;
    }

    return (
      <Card className="w-full shadow-none border-none">
        <CardHeader className="border-b gap-0">
          <CardTitle>Add a new product types to the system</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full">
            <ReportingForm
              agentList={agentList}
              planList={planList}
              doList={doList}
              clientList={clientList}
              branchList={branchList}
              productList={productList}
              apiUsersList={apiUsersList}
              cityList={cityList}
              couponList={couponList}
            />
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <div className="flex flex-row items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold">Reporting Filters</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            size="lg"
            className="min-w-[150px]"
            onClick={() => downloadMISMutation.mutate()}
            disabled={downloadMISMutation.isPending}
          >
            Download MIS
            {downloadMISMutation.isPending && (
              <Loader className="ml-2 h-4 w-4 animate-spin" />
            )}
          </Button>
        </div>
      </div>

      {renderPageContent()}
    </>
  );
};

export default ReportingWrapper;
