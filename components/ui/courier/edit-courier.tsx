"use client";

import Error from "../foundations/error"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { fetchSingleCourier } from "@/helperFunctions/courierFunction"
import Empty from "../foundations/empty"
import SubNav from "../foundations/sub-nav";
import { Card, CardContent, CardHeader, CardTitle } from "../shadcn/card";
import { Button } from "../shadcn/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import LoadingState from "../foundations/loading-state";
import useCourierIdStore from "@/hooks/useCourierIdStore";
import { CourierResponseType } from "@/types/courierTypes";
import EditCourierForm from "./edit-courier-form";
import { getRights } from "@/utils/getRights";
import { useMemo, useEffect } from "react";

const EditCourier = () => {

  // Constants
  const LISTING_ROUTE = '/cites-couiers/couriers'
  const { courierId } = useCourierIdStore();
  const router = useRouter()

  // ======== MEMOIZATION ========
  const rights = useMemo(() => { return getRights(LISTING_ROUTE) }, [LISTING_ROUTE])


  // Fetch single courier us
  const { data: singleCourierResponse, isLoading: singleCourierLoading, isError: singleCourierIsError, error } = useQuery<CourierResponseType | null>({
    queryKey: ["single-courier", courierId],
    queryFn: () => fetchSingleCourier(courierId!),
    enabled: !!courierId // Only fetch if courierId is available
  })

  // ======== RENDER LOGIC ========

  useEffect(() => {
    if (!rights) return;
    if (rights?.can_edit === "0") {
      const timer = setTimeout(() => {
        router.push("/");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [rights, router]);

  if (rights?.can_edit === "0") {
    return (
      <Empty
        title="Permission Denied"
        description="You do not have rights to edit courier."
      />
    );
  }


  // Loading state
  if (singleCourierLoading) {
    return <LoadingState />
  }

  // Error state
  if (singleCourierIsError) {
    return <Error err={error?.message} />
  }

  // Empty and redirect state
  if (!courierId) {
    setTimeout(() => {
      router.push(LISTING_ROUTE)
    })
    return <Empty title="Not Found" description="CourierId not Found. Redirecting to Courier List..." />;
  }

  return (
    <>
      <SubNav
        title='Edit Courier'
      />

      <Card className='w-full shadow-none border-none'>
        <CardHeader className='border-b gap-0'>
          <CardTitle>
            <div className='flex items-center gap-2'>
              <Button variant="ghost" size="icon" className='rounded-full border border-gray-200' asChild>
                <Link href={LISTING_ROUTE}>
                  <ArrowLeft className='size-6' />
                </Link>
              </Button>
              Edit existing courier to the system
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='w-full'>
            <EditCourierForm singleCourier={singleCourierResponse?.payload[0]} />
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default EditCourier
