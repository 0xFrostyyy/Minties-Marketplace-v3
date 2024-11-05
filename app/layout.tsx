import { ThirdwebProvider } from "thirdweb/react";
import { Toaster } from "react-hot-toast";
import { Navbar } from "@/components/Navbar";
import Image from "next/image";
import "@/globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "thirdweb Marketplace Template",
  description:
		"Create an NFT marketplace on top of your NFT collection on any EVM-compatible blockchain.",
};

export default function RootLayout({
  children,
}: {
	children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="relative overflow-x-hidden max-w-screen bg-[#B0FE76]">

        <Toaster />
        <ThirdwebProvider>
          <Navbar />
          <div className="w-screen min-h-screen">
            <div className="px-8 mx-auto mt-32 max-w-7xl">
              {children}
            </div>
          </div>
        </ThirdwebProvider>
      </body>
    </html>
  );
}
