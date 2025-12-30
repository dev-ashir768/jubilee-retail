import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Home | Jubilee Retail',
  description: 'Welcome to Jubilee General Retail',
}

const page = () => {
  return (
    <>
      <div className="w-full h-full flex justify-center items-center">
        <h1 className="text-gray-600 text-3xl tracking-wide">
          Welcome to Jubilee General Retail
        </h1>
      </div>
    </>
  );
};

export default page;
