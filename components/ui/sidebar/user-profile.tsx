"use client";

import { ChevronsUpDown, Key, LogOut, User } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/shadcn/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/shadcn/dropdown-menu";
import { useSidebar } from "@/components/ui/shadcn/sidebar";
import { Button } from "@/components/ui/shadcn/button";
import Link from "next/link";
import { handleLogout } from "@/utils/handleLogout";
import { userInfoTypes } from "@/types/verifyOtpTypes";
import UpdatePasswordDialog from "../users/update-password-dialog";
import { useCallback, useState } from "react";

interface UserProfileProps {
  userInfo: userInfoTypes;
}

const UserProfile: React.FC<UserProfileProps> = ({ userInfo }) => {
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const { isMobile } = useSidebar();

  // ======= HANDLER =======
  const handleUpdatePassowrdDialog = useCallback(() => {
    setIsFilterOpen(!isFilterOpen);
  }, [setIsFilterOpen, isFilterOpen]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="lg"
            className="!px-0 hover:bg-transparent focus-visible:ring-0 [&[data-state=open]>svg]:rotate-180"
          >
            <Avatar className="h-[34px] w-[34px] rounded-md bg-gray-100 p-1">
              <AvatarImage src="/images/user-avatar.png" alt="user-avatar" />
              <AvatarFallback className="rounded-lg">CN</AvatarFallback>
            </Avatar>
            {!isMobile && (
              <>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {userInfo.fullname}
                  </span>
                  <span className="truncate text-xs">{userInfo.email}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-(--radix-dropdown-menu-trigger-width) min-w-[210px] rounded-md border-0 shadow-[0px_2px_8px_0px_rgba(99,99,99,0.2)]"
          side={isMobile ? "bottom" : "bottom"}
          align="end"
          sideOffset={4}
        >
          {isMobile && (
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-[34px] w-[34px] rounded-md bg-gray-100 p-1">
                  <AvatarImage
                    src="/images/user-avatar.png"
                    alt="user-avatar"
                  />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {userInfo.fullname}
                  </span>
                  <span className="truncate text-xs">{userInfo.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
          )}
          {isMobile && <DropdownMenuSeparator />}
          <DropdownMenuGroup>
            <DropdownMenuItem className="cursor-pointer" asChild>
              <Link href="/user-profile">
                <User />
                User Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={handleUpdatePassowrdDialog}
            >
              <Key />
              Update Password
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={handleLogout}
              asChild
            >
              <Link href="/login">
                <LogOut />
                Logout
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <UpdatePasswordDialog
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
      />
    </>
  );
};

export default UserProfile;
