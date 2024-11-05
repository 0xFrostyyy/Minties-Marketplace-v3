"use client";
import React from "react";
import { useActiveAccount, ConnectButton } from "thirdweb/react";
import Image from "next/image";
import Link from "next/link";
import { NETWORK, ALLOWED_WALLETS } from "@/const/contracts";
import client from "@/lib/client";

export function Navbar() {
  const account = useActiveAccount();  // Get the connected account
  const isAllowedWallet =
    account && ALLOWED_WALLETS.some(wallet => wallet.toLowerCase() === account.address.toLowerCase());

  console.log("Connected account:", account?.address);
  console.log("Allowed wallets:", ALLOWED_WALLETS);
  console.log("Is allowed wallet:", isAllowedWallet);

  return (
    <div className="fixed top-0 z-10 flex items-center justify-center w-full bg-transparent text-black/60 backdrop-blur-md">
      <nav className="flex items-center justify-between w-full px-8 py-5 mx-auto max-w-7xl">
        <div className="flex items-center gap-3">
          <Link href="/" className="mr-4">
            <Image
              src="/minties3.png"
              width={48}
              height={48}
              alt="NFT marketplace sample logo"
            />
          </Link>

          <div className="flex items-center gap-6 font-medium">
            <Link href="/buy" className="transition hover:text-black/100">
              Buy
            </Link>
            {/* Conditionally render the "Sell" link if the connected wallet is allowed */}
            {isAllowedWallet && (
              <Link href="/sell" className="transition hover:text-black/100">
                Sell
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center gap-4">
          <ConnectButton
            theme="dark"
            client={client}
            chain={NETWORK}
          />
        </div>
      </nav>
    </div>
  );
}
