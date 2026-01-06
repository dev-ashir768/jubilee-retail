import { Metadata } from "next";
import HomeWrapper from "@/components/ui/home/home-wrapper";

export const metadata: Metadata = {
  title: "Home | Jubilee Retail",
  description: "Welcome to Jubilee General Retail",
};

const page = () => {
  return (
    <>
     <HomeWrapper />
    </>
  );
};

export default page;
