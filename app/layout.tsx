import type { Metadata } from "next";
import "@/app/globals.css";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "@/components/ui/shadcn/sonner";
import TanstackQueryProvider from "@/providers/TanstackClientProvider";
import { primaryText } from "./fonts/font";

export const metadata: Metadata = {
  title: "Jubilee Retail",
  description: "Jubilee Retail",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${primaryText.className} antialiased`}>
        <TanstackQueryProvider>
          <NextTopLoader
            color="var(--primary)"
            showSpinner={false}
            speed={200}
            easing="ease"
          />
          <Toaster position="bottom-right" richColors />
          {children}
        </TanstackQueryProvider>
      </body>
    </html>
  );
}
