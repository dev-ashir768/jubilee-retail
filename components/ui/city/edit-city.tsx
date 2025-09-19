"use client";

import Error from "../foundations/error"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { fetchSingleCity } from "@/helperFunctions/cityFunction"
import Empty from "../foundations/empty"
import { CityResponseType } from "@/types/cityTypes"
import SubNav from "../foundations/sub-nav";
import { Card, CardContent, CardHeader, CardTitle } from "../shadcn/card";
import { Button } from "../shadcn/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import LoadingState from "../foundations/loading-state";
import useCityIdStore from "@/hooks/useCityIdStore";
import EditCityForm from "./edit-city-form";
import { useMemo, useEffect } from "react";
import { getRights } from "@/utils/getRights";

const EditCity = () => {

  // Constants
  const LISTING_ROUTE = '/cites-couiers/cities'
  const { cityId } = useCityIdStore();
  const router = useRouter();

  // ======== MEMOIZATION ========
  const rights = useMemo(() => { return getRights(LISTING_ROUTE) }, [LISTING_ROUTE])


  // Fetch single city us
  const { data: singleCityResponse, isLoading: singleCityLoading, isError: singleCityIsError, error } = useQuery<CityResponseType | null>({
    queryKey: ["single-city", cityId],
    queryFn: () => fetchSingleCity(cityId!),
    enabled: !!cityId // Only fetch if cityId is available
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
        description="You do not have rights to edit city."
      />
    );
  }


  // Loading state
  if (singleCityLoading) {
    return <LoadingState />
  }

  // Error state
  if (singleCityIsError) {
    return <Error err={error?.message} />
  }

  // Empty and redirect state
  if (!cityId) {
    setTimeout(() => {
      router.push(LISTING_ROUTE)
    })
    return <Empty title="Not Found" description="City Id not Found. Redirecting to City List..." />;
  }

  return (
    <>
      <SubNav
        title='Edit City'
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
              Edit existing city in the system
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='w-full'>
            <EditCityForm singleCity={singleCityResponse?.payload[0]} />
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default EditCity
