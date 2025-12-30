import { DashboardWrapper } from "@/components/ui/dashboard/dashboard-wrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Dashboard | Jubilee Retail',
  description: 'Welcome to Jubilee General Retail',
}

const page = () => {
  return (
    <>
      <DashboardWrapper />
    </>
  );
};

export default page;
