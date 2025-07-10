"use client";

import React, { useMemo } from 'react'
import EditUserForm from '@/components/ui/users/edit-user-form'
import useUserIdStore from '@/hooks/useAddUserIdStore'
import { allMenusResponse } from '@/types/menus';
import { SingleUserResponseType } from '@/types/usersTypes';
import { useQuery } from '@tanstack/react-query';
import { fetchAllMenus } from '@/helperFunctions/allMenusFunction';
import { fetchSingleUser } from '@/helperFunctions/userFunction';
import Loader from '@/components/ui/foundations/loader';
import { getRights } from '@/utils/getRights';
import Empty from '@/components/ui/foundations/empty';
import { useRouter } from 'next/navigation';

const page = () => {
  const { userId } = useUserIdStore()
  const router = useRouter()
  // Define constants
  const LISTING_ROUTE = '/users/user-list'

  // Rights
  const rights = useMemo(() => {
    return getRights(LISTING_ROUTE)
  }, [LISTING_ROUTE])

  if (rights?.can_edit !== "1") {
    setTimeout(() => {
      router.back();
    }, 1500);
    return <Empty title="Permission Denied" description="You do not have permission to edit a existing user." />;
  }


  // fetch all menus and single user
  const { data: allMenusResponse, isLoading: allMenusLoading } = useQuery<allMenusResponse | null>({
    queryKey: ["all-menus"],
    queryFn: fetchAllMenus
  })

  const { data: singleUserResponse, isLoading: singleUserLoading } = useQuery<SingleUserResponseType | null>({
    queryKey: ["single-user", userId],
    queryFn: () => fetchSingleUser(userId),
    enabled: !!userId,
  });

  // loading state while fetching user list data
  if (allMenusLoading || singleUserLoading) {
    return <Loader />
  }

  return (
    <>
      <EditUserForm allMenus={allMenusResponse?.payload[0]} singleUser={singleUserResponse?.payload[0]} />
    </>
  )
}

export default page