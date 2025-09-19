"use client";

import useIgisMakeIdStore from "@/hooks/useIgisMakeIdStore"
import Error from "../foundations/error"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { fetchSingleIgisMake } from "@/helperFunctions/igisFunction"
import Empty from "../foundations/empty"
import { IgisMakeResponseType } from "@/types/igisTypes"
import SubNav from "../foundations/sub-nav";
import { Card, CardContent, CardHeader, CardTitle } from "../shadcn/card";
import { Button } from "../shadcn/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import EditIgisMakeForm from "./edit-igis-make-form";
import LoadingState from "../foundations/loading-state";
import { useMemo, useEffect } from "react";
import { getRights } from "@/utils/getRights";

const EditIgisMake = () => {

  // Constants
  const LISTING_ROUTE = '/igis/igis-makes'
  const { igisMakeId } = useIgisMakeIdStore()
  const router = useRouter()

  // ======== MEMOIZATION ========
  const rights = useMemo(() => { return getRights(LISTING_ROUTE) }, [LISTING_ROUTE])

  // Fetch single igis make
  const { data: singleIgisMakeResponse, isLoading: singleIgisMakeLoading, isError: singleIgisMakeIsError, error } = useQuery<IgisMakeResponseType | null>({
    queryKey: ["single-igis-make", igisMakeId],
    queryFn: () => fetchSingleIgisMake(igisMakeId!),
    enabled: !!igisMakeId // Only fetch if igisMakeId is available
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
        description="You do not have rights."
      />
    );
  }


  // Loading state
  if (singleIgisMakeLoading) {
    return <LoadingState />
  }

  // Error state
  if (singleIgisMakeIsError) {
    return <Error err={error?.message} />
  }

  // Empty and redirect state
  if (!igisMakeId) {
    setTimeout(() => {
      router.push(LISTING_ROUTE)
    })
    return <Empty title="Not Found" description="Igis make Id not Found. Redirecting to Igis make List..." />;
  }

  return (
    <>
      <SubNav
        title='Edit IGIS Make'
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
              Edit existing IGIS make to the system
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='w-full'>
            <EditIgisMakeForm singleIgisMake={singleIgisMakeResponse?.payload[0]} />
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default EditIgisMake
