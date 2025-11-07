import React from "react";
import SubNav from "../foundations/sub-nav";
import { Card, CardContent, CardHeader, CardTitle } from "../shadcn/card";
import { Button } from "../shadcn/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import UserProfileForm from "./user-profile-form";

const UserProfileWrapper = () => {
  return (
    <>
      <SubNav title="User Profile" />

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
                <Link href="/">
                  <ArrowLeft className="size-6" />
                </Link>
              </Button>
              Edit your profile
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full md:w-1/2">
            <UserProfileForm />
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default UserProfileWrapper;
