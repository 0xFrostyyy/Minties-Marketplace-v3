"use client";
import React from "react";
import type { NFT as NFTType } from "thirdweb";
import NFT, { LoadingNFTComponent } from "./NFT";
import { DirectListing, EnglishAuction } from "thirdweb/extensions/marketplace";

type NFTGridProps = {
  nftData: Array<{
    tokenId?: bigint; // Optional here, but we'll ensure it's defined before passing to NFT
    nft?: NFTType;
    directListing?: DirectListing;
    auctionListing?: EnglishAuction;
  }>;
  overrideOnclickBehavior?: (nft: NFTType) => void;
  emptyText?: string;
};

export default function NFTGrid({
  nftData,
  overrideOnclickBehavior,
  emptyText = "No NFTs found for this collection.",
}: NFTGridProps) {
  return (
    <div className="my-8">
      {nftData.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {nftData.map((nftItem, index) => (
            <NFT
              key={nftItem.tokenId ? nftItem.tokenId.toString() : `nft-${index}`} // Fallback to index if tokenId is missing
              tokenId={nftItem.tokenId || BigInt(0)} // Provide a fallback bigint value
              nft={nftItem.nft}
              directListing={nftItem.directListing}
              auctionListing={nftItem.auctionListing}
              overrideOnclickBehavior={overrideOnclickBehavior}
            />
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center h-[500px]">
          <p className="max-w-lg text-lg font-semibold text-center text-black/60">
            {emptyText}
          </p>
        </div>
      )}
    </div>
  );
}

// Loading component for NFTGrid
export function NFTGridLoading() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 20 }).map((_, index) => (
        <LoadingNFTComponent key={index} />
      ))}
    </div>
  );
}
