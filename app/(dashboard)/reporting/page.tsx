import { Metadata } from "next";
import ReportingWrapper from "@/components/ui/reporting/reporting-wrapper";

export const metadata: Metadata = {
  title: 'Reporting | Jubilee Retail',
}

const page = () => {
  return (
    <>
      <ReportingWrapper />
    </>
  );
};

export default page;
