import CommunicationLogList from "@/components/ui/communication-log/communication-log-list";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: 'Communication Log | Jubilee Retail',
}

const page = () => {
  return (
    <>
      <CommunicationLogList />
    </>
  );
};

export default page;
