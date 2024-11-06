"use client";
import React, { useEffect, useState } from "react";
import { useActiveAccount, MediaRenderer } from "thirdweb/react"; 
import NFTGrid, { NFTGridLoading } from "@/components/NFT/NFTGrid";
import { NFT_COLLECTION, MARKETPLACE, ALLOWED_WALLETS } from "@/const/contracts";  // Import MARKETPLACE directly
import toast from "react-hot-toast";
import toastStyle from "@/util/toastConfig";
import { getNFTs, ownerOf, totalSupply } from "thirdweb/extensions/erc721";
import client from "@/lib/client";
import { Cross1Icon } from "@radix-ui/react-icons";
import { NFT as NFTType } from "thirdweb";
import { prepareContractCall, sendTransaction } from "thirdweb";
import { ConnectButton } from "thirdweb/react";

import { NETWORK } from "@/const/contracts";
type NFTWithOptionalSupply = NFTType & { supply?: bigint };

export default function Sell() {
  const [loading, setLoading] = useState(false);
  const [ownedNFTs, setOwnedNFTs] = useState<NFTWithOptionalSupply[]>([]);
  const [selectedNft, setSelectedNft] = useState<NFTWithOptionalSupply | undefined>();
  const [currencyAddress, setCurrencyAddress] = useState("");
  const [pricePerToken, setPricePerToken] = useState("");
  const [reserved, setReserved] = useState(false);
  const account = useActiveAccount();
  const isAllowedWallet =
  account && ALLOWED_WALLETS.some(wallet => wallet.toLowerCase() === account.address.toLowerCase());


  useEffect(() => {
    const fetchOwnedNFTs = async () => {
      if (!account) return;

      setLoading(true);
      try {
        const totalNFTSupply = await totalSupply({ contract: NFT_COLLECTION });
        const nfts = await getNFTs({
          contract: NFT_COLLECTION,
          start: 0,
          count: parseInt(totalNFTSupply.toString()),
        });

        const userOwnedNFTs: NFTWithOptionalSupply[] = [];
        const seenTokenIds = new Set();

        for (const nft of nfts) {
          const owner = await ownerOf({ contract: NFT_COLLECTION, tokenId: nft.id });
          if (owner.toLowerCase() === account.address.toLowerCase() && !seenTokenIds.has(nft.id)) {
            seenTokenIds.add(nft.id);
            userOwnedNFTs.push(nft);
          }
        }

        setOwnedNFTs(userOwnedNFTs);
      } catch (err) {
        toast.error("Error fetching your NFTs", {
          position: "bottom-center",
          style: toastStyle,
        });
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOwnedNFTs();
  }, [account]);

  const createListing = async () => {
	if (!selectedNft || !account) return;
  
	try {
	  // Force approval for all NFTs in this collection each time
	  const approvalTransaction = await prepareContractCall({
		contract: NFT_COLLECTION,
		method: "setApprovalForAll",
		params: [MARKETPLACE.address, true],
	  });
	  await sendTransaction({
		transaction: approvalTransaction,
		account,
	  });
  
	  toast.success("Marketplace approved for NFT transfers.", {
		position: "bottom-center",
		style: toastStyle,
	  });
  
	  // Define the listing parameters
	  const params = {
		assetContract: NFT_COLLECTION.address,
		tokenId: BigInt(selectedNft.id),
		quantity: BigInt(1),
		currency: currencyAddress || "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // Use input or default to native
		pricePerToken: BigInt(parseInt(pricePerToken)),
		startTimestamp: BigInt(Math.floor(Date.now() / 1000)), // Current timestamp
		endTimestamp: BigInt(Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365), // 1 year from now
		reserved: reserved,
	  };
  
	  // Prepare and send the transaction for creating the listing
	  const transaction = await prepareContractCall({
		contract: MARKETPLACE,
		method: "createListing",
		params: [params],
	  });
  
	  await sendTransaction({
		transaction,
		account,
	  });
  
	  toast.success("NFT listed successfully!", {
		position: "bottom-center",
		style: toastStyle,
	  });
	  setSelectedNft(undefined);
	} catch (error) {
	  console.error("Error creating listing:", error);
	  toast.error("Failed to create listing", {
		position: "bottom-center",
		style: toastStyle,
	  });
	}
  };
  
  

  return (
	<div>
    {!account ? (
      <div>
        
		<ConnectButton
		theme="dark"
		client={client}
		chain={NETWORK}
		/>
      </div>
    ) : (
      isAllowedWallet ? (
    <div>
      <h1 className="text-4xl">Sell NFTs</h1>
      <div className="my-8">
        {!selectedNft ? (
          <>
            {loading ? (
              <NFTGridLoading />
            ) : (
              <NFTGrid
                nftData={ownedNFTs.map((nft) => ({
                  tokenId: nft.id,
                  nft: nft,
                  directListing: undefined,
                  auctionListing: undefined,
                }))}
                overrideOnclickBehavior={(nft) => setSelectedNft(nft)}
                emptyText="No NFTs found for this collection."
              />
            )}
          </>
        ) : (
          <div className="flex max-w-full gap-8 mt-0">
            <div className="flex flex-col w-full">
              <div className="relative">
                <MediaRenderer
                  client={client}
                  src={selectedNft.metadata.image}
                  className="rounded-lg !w-full !h-auto bg-white/[.04]"
                />
                <button
                  onClick={() => setSelectedNft(undefined)}
                  className="absolute top-0 right-0 m-3 transition-all cursor-pointer hover:scale-110"
                >
                  <Cross1Icon className="w-6 h-6" />
                </button>
              </div>
              <div className="mt-4">
                <h2 className="text-2xl">Listing Details</h2>
                <input
                  type="text"
                  placeholder="Price per Token (in Wei)"
                  value={pricePerToken}
                  onChange={(e) => setPricePerToken(e.target.value)}
                  className="w-full mt-2 p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Currency Address (optional)"
                  value={currencyAddress}
                  onChange={(e) => setCurrencyAddress(e.target.value)}
                  className="w-full mt-2 p-2 border rounded"
                  />

                <div className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    checked={reserved}
                    onChange={(e) => setReserved(e.target.checked)}
                    className="mr-2"
                  />
                  <label>Reserved Listing</label>
                </div>
				
                <button
                  onClick={createListing}
                  className="mt-4 w-full bg-blue-500 text-black p-2 rounded hover:bg-blue-600"
                >
                  Create Listing
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
	 ) : <div>Wallet not allowed: {account?.address}</div>
    )}
  </div>
  );
}
