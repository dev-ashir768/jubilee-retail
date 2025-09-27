"use client";

import React, { useEffect, useMemo } from "react";
import SubNav from "../foundations/sub-nav";
import { useRouter } from "next/navigation";
import { getRights } from "@/utils/getRights";
import PaymentModesDatatable from "./payment-modes-datatable";
import LoadingState from "../foundations/loading-state";
import Error from "../foundations/error";
import Empty from "../foundations/empty";
import {
  PaymentModesPayloadType,
  PaymentModesResponseType,
} from "@/types/paymentModesTypes";
import { useQuery } from "@tanstack/react-query";
import {
  createFilterOptions,
  fetchPaymentModesList,
} from "@/helperFunctions/paymentModesFunction";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../shadcn/dropdown-menu";
import { Button } from "../shadcn/button";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import Link from "next/link";
import { ColumnMeta } from "@/types/dataTableTypes";
import { Badge } from "../shadcn/badge";
import DatatableColumnHeader from "../datatable/datatable-column-header";
import { ColumnDef } from "@tanstack/react-table";
import usePaymentModesIdStore from "@/hooks/paymentModesIdStore";

const PaymentModesList = () => {
  // ======== CONSTANTS & HOOKS ========
  const ADD_ROUTE = "/products-plans/add-plan";
  const EDIT_ROUTE = "/products-plans/edit-plan";
  const LISTING_ROUTE = "/products-plans/plan";
  const {setPaymentModesId} = usePaymentModesIdStore()
  const router = useRouter();

  // ======== MEMOIZATION ========
  const rights = useMemo(() => {
    return getRights(LISTING_ROUTE);
  }, [LISTING_ROUTE]);

  // ======== DATA FETCHING ========
  const {
    data: paymentModesListData,
    isLoading: paymentModesListLoading,
    isError: paymentModesListIsError,
    error: paymentModesListError,
  } = useQuery<PaymentModesResponseType | null>({
    queryKey: ["payment-modes-list"],
    queryFn: fetchPaymentModesList,
  });

  // ======== PAYLOADS DATA ========
  const paymentModesList = useMemo(
    () => paymentModesListData?.payload || [],
    [paymentModesListData]
  );

  // ======== FILTER OPTIONS ========
  const nameFilterOptions = useMemo(
    () => createFilterOptions(paymentModesList, "name"),
    [paymentModesList]
  );

    const paymentCodFilterOptions = useMemo(
    () => createFilterOptions(paymentModesList, "payment_code"),
    [paymentModesList]
  );

  // ======== COLUMN DEFINITIONS ========
  const columns: ColumnDef<PaymentModesPayloadType>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: nameFilterOptions,
        filterPlaceholder: "Filter by name...",
      } as ColumnMeta,
    },
    {
      accessorKey: "payment_code",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Payment Code" />
      ),
      cell: ({ row }) => <div>{row.getValue("payment_code")}</div>,
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: paymentCodFilterOptions,
        filterPlaceholder: "Filter by payment code...",
      } as ColumnMeta,
    },
    {
      accessorKey: "is_active",
      header: ({ column }) => (
        <DatatableColumnHeader column={column} title="Status" />
      ),
      accessorFn: (row) => (row.is_active ? "active" : "inactive"),
      cell: ({ row }) => {
        const status = row.getValue("is_active") as string;
        return (
          <Badge variant={status === "active" ? "success" : "danger"}>
            {status}
          </Badge>
        );
      },
      filterFn: "multiSelect",
      meta: {
        filterType: "multiselect",
        filterOptions: [
          { value: "active", label: "Active" },
          { value: "in_active", label: "Inactive" },
        ],
        filterPlaceholder: "Filter status...",
      } as ColumnMeta,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const record = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {rights?.can_edit === "1" && (
                <DropdownMenuItem onClick={() => setPaymentModesId(record.id)} asChild>
                  <Link href={EDIT_ROUTE}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </DropdownMenuItem>
              )}
              {rights?.can_edit === "1" && (
                <DropdownMenuItem>
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // ======== RENDER LOGIC ========
  const isLoading = paymentModesListLoading;
  const isError = paymentModesListIsError;
  const onError = paymentModesListError?.message;

  useEffect(() => {
    if (rights && rights?.can_view === "0") {
      const timer = setTimeout(() => {
        router.push("/");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [rights, router]);

  if (isLoading) return <LoadingState />;
  if (isError) return <Error err={onError} />;
  if (rights && rights?.can_view === "0")
    return (
      <Empty
        title="Permission Denied"
        description="You do not have permission."
      />
    );

  return (
    <>
      <SubNav
        title="Payment Modes List"
        addBtnTitle="Add Payment Mode"
        urlPath={ADD_ROUTE}
      />

      <PaymentModesDatatable columns={columns} payload={paymentModesList} />
    </>
  );
};

export default PaymentModesList;
