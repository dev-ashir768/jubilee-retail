import React, { useMemo } from 'react'
import SubNav from '../foundations/sub-nav'
import { Card, CardContent, CardHeader, CardTitle } from '../shadcn/card'
import { Button } from '../shadcn/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { getRights } from '@/utils/getRights'
import Empty from '../foundations/empty'

const AddBranch = () => {
  // Constants
  const LISTING_ROUTE = '/branches-clients/branch-list'
  const router = useRouter();

  // Rights
  const rights = useMemo(() => {
    return getRights(LISTING_ROUTE)
  }, [LISTING_ROUTE])


  // Rights Redirection
  if (rights?.can_create !== "1") {
    setTimeout(() => {
      router.back();
    }, 1500);
    return <Empty title="Permission Denied" description="You do not have permission to add new branch." />;
  }
  return (
    <>
      <SubNav title="Add Branch" />

      <Card className="w-full shadow-none border-none">
        <CardHeader className="border-b gap-0">
          <CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full border border-gray-200 cursor-pointer"
                onClick={() => router.push(LISTING_ROUTE)}
              >
                <ArrowLeft className="size-6" />
              </Button>
              Add a new branch to the system
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full">
            <AddBranch />
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default AddBranch
