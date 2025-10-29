"use client";

import React, { useMemo } from "react";
import SubNav from "../foundations/sub-nav";
import { AgentResponseTypes } from "@/types/agentTypes";
import { fetchAgentList } from "@/helperFunctions/agentFunction";
import { useQuery } from "@tanstack/react-query";
import ReportingForm from "./reporting-form";
import LoadingState from "../foundations/loading-state";
import Error from "../foundations/error";
import { BranchResponseType } from "@/types/branchTypes";
import { fetchBranchList } from "@/helperFunctions/branchFunction";
import { ClientResponseType } from "@/types/clientTypes";
import { fetchClientList } from "@/helperFunctions/clientFunction";
import { DevelopmentOfficerResponseTypes } from "@/types/developmentOfficerTypes";
import { fetchDevelopmentOfficerList } from "@/helperFunctions/developmentOfficerFunction";
import { fetchProductsList } from "@/helperFunctions/productsFunction";
import { ProductsResponseTypes } from "@/types/productsTypes";
import { PlanResponseTypes } from "@/types/planTypes";
import { fetchPlansList } from "@/helperFunctions/plansFunction";
import { fetchApiUserList } from "@/helperFunctions/userFunction";
import { ApiUsersResponseType } from "@/types/usersTypes";
import { Card, CardContent, CardHeader, CardTitle } from "../shadcn/card";

const ReportingWrapper = () => {
  // ======== DATA FETCHING ========
  const {
    data: agentListResponse,
    isLoading: agentListLoading,
    isError: agentListIsError,
    error: agentListError,
  } = useQuery<AgentResponseTypes | null>({
    queryKey: ["agents-list"],
    queryFn: fetchAgentList,
  });

  const {
    data: branchListResponse,
    isLoading: branchListLoading,
    isError: branchListIsError,
    error: branchListError,
  } = useQuery<BranchResponseType | null>({
    queryKey: ["branches-list"],
    queryFn: fetchBranchList,
  });

  const {
    data: clientListResponse,
    isLoading: clientListLoading,
    isError: clientListIsError,
    error: clientListError,
  } = useQuery<ClientResponseType | null>({
    queryKey: ["client-list"],
    queryFn: fetchClientList,
  });

  const {
    data: doListResponse,
    isLoading: doListLoading,
    isError: doListIsError,
    error: doListError,
  } = useQuery<DevelopmentOfficerResponseTypes | null>({
    queryKey: ["development-officers-list"],
    queryFn: fetchDevelopmentOfficerList,
  });

  const {
    data: productListResponse,
    isLoading: productListLoading,
    isError: productListIsError,
    error: productListError,
  } = useQuery<ProductsResponseTypes | null>({
    queryKey: ["products-list"],
    queryFn: fetchProductsList,
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
    data: apiUsersListResponse,
    isLoading: apiUsersListLoading,
    isError: apiUsersListIsError,
    error: apiUsersListError,
  } = useQuery<ApiUsersResponseType | null>({
    queryKey: ["api-user-list"],
    queryFn: fetchApiUserList,
  });

  // ======== PAYLOADS DATA ========
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

  // ======== RENDER LOGIC ========
  const isLoading =
    agentListLoading ||
    planListLoading ||
    apiUsersListLoading ||
    productListLoading ||
    doListLoading ||
    clientListLoading ||
    branchListLoading;
  const isError =
    agentListIsError ||
    apiUsersListIsError ||
    planListIsError ||
    productListIsError ||
    doListIsError ||
    clientListIsError ||
    branchListIsError;
  const onError =
    agentListError?.message ||
    apiUsersListError?.message ||
    planListError?.message ||
    productListError?.message ||
    clientListError?.message ||
    branchListError?.message ||
    doListError?.message;

  return (
    <>
      <SubNav title="Reporting Filters" />

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <Error err={onError} />
      ) : (
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
              />
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default ReportingWrapper;
