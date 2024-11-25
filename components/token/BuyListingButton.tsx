"use client";
import { TransactionButton, useActiveAccount } from "thirdweb/react";
import {
  DirectListing,
  EnglishAuction,
  buyFromListing,
  buyoutAuction,
} from "thirdweb/extensions/marketplace";
import { MARKETPLACE } from "@/const/contracts";
import toastStyle from "@/util/toastConfig";
import toast from "react-hot-toast";
import { ethers } from 'ethers';

// Encode ERC20 approve function call
function encodeApproveCall(spender: string) {
  // approve(address,uint256) function signature
  const functionSignature = '0x095ea7b3';
  // Pad the address to 32 bytes
  const paddedAddress = spender.toLowerCase().slice(2).padStart(64, '0');
  // Max uint256 value padded to 32 bytes
  const paddedAmount = 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
  
  return `${functionSignature}${paddedAddress}${paddedAmount}`;
}

export default function BuyListingButton({
  auctionListing,
  directListing,
}: {
  auctionListing?: EnglishAuction;
  directListing?: DirectListing;
}) {
  const account = useActiveAccount();

  const handleTransaction = async (): Promise<any> => {
    if (!account) {
      toast.error("Please connect your wallet first", {
        position: "bottom-center",
        style: toastStyle,
      });
      throw new Error("No wallet connected");
    }

    if (!account.sendTransaction || typeof account.sendTransaction !== 'function') {
      console.error("Invalid account structure:", account);
      toast.error("Wallet connection issue. Please try reconnecting.", {
        position: "bottom-center",
        style: toastStyle,
      });
      throw new Error("Invalid account configuration");
    }
    
    
    try {
		if (directListing) {
			if (!directListing.currencyContractAddress) {
			  throw new Error("Invalid listing currency contract");
			}
		  
			const approvalTx = {
			  to: directListing.currencyContractAddress,
			  data: encodeApproveCall(MARKETPLACE.address) as `0x${string}`,
			  authorizationList: [],
			  chainId: 1  // replace with your chain ID
			};
		  
			console.log("Sending approval transaction:", approvalTx);
		  
			const approvalResult = await account.sendTransaction(approvalTx);
			console.log("Approval transaction sent:", approvalResult);
		  
			toast.success("Token spending approved", {
			  position: "bottom-center",
			  style: toastStyle,
			});
		  
			await new Promise(resolve => setTimeout(resolve, 2000));
		  
			const buyTransaction = buyFromListing({
			  contract: MARKETPLACE,
			  listingId: directListing.id,
			  recipient: account.address,
			  quantity: BigInt(1),
			});
		  
			if (!buyTransaction) {
			  throw new Error("Failed to prepare buy transaction");
			}
		  
			return buyTransaction;
  
		} else if (auctionListing) {
		  if (!auctionListing.currencyContractAddress) {
			throw new Error("Invalid auction currency contract");
		  }
  
		  const approvalTx = {
			to: auctionListing.currencyContractAddress,
			data: encodeApproveCall(MARKETPLACE.address) as `0x${string}`,
			authorizationList: [],
			chainId: 1  // replace with your chain ID
		  };
  
		  console.log("Sending auction approval transaction:", approvalTx);
  

        console.log("Sending auction approval transaction:", approvalTx);

        const approvalResult = await account.sendTransaction(approvalTx);
        console.log("Auction approval transaction sent:", approvalResult);

        toast.success("Token spending approved", {
          position: "bottom-center",
          style: toastStyle,
        });

        await new Promise(resolve => setTimeout(resolve, 2000));

        return buyoutAuction({
          contract: MARKETPLACE,
          auctionId: auctionListing.id,
        });
      } else {
        throw new Error("No valid listing found for this NFT");
      }
    } catch (error: any) {
      console.error("Transaction Error:", {
        error,
        message: error.message,
        listing: directListing || auctionListing,
      });
      throw error;
    }
  };

  return (
    <TransactionButton
      disabled={
        !account || 
        account?.address === auctionListing?.creatorAddress ||
        account?.address === directListing?.creatorAddress ||
        (!directListing && !auctionListing)
      }
      transaction={handleTransaction}
      onTransactionSent={() => {
        toast.loading("Processing purchase...", {
          id: "buy",
          style: toastStyle,
          position: "bottom-center",
        });
      }}
      onError={(error) => {
        console.error("Transaction Error Details:", error);
        let errorMessage = "Purchase Failed! Please make sure you have enough tokens and they are approved for spending.";
        
        if (error instanceof Error) {
          if (error.message.toLowerCase().includes("user denied") || 
              error.message.toLowerCase().includes("user rejected")) {
            errorMessage = "Transaction was rejected by user";
          } else {
            errorMessage = error.message;
          }
        }
        
        toast(errorMessage, {
          icon: "❌",
          id: "buy",
          style: toastStyle,
          position: "bottom-center",
          duration: 5000,
        });
      }}
      onTransactionConfirmed={(txResult) => {
        console.log("Transaction Confirmed:", {
          hash: txResult.transactionHash,
          timestamp: new Date().toISOString(),
          type: auctionListing ? "auction" : "direct",
          listingId: auctionListing?.id || directListing?.id
        });

        toast("Purchased Successfully!", {
          icon: "🥳",
          id: "buy",
          style: toastStyle,
          position: "bottom-center",
        });
      }}
      style={{
        backgroundColor: "#EED3B1",
        color: "#000",
      }}
    >
      Buy Now
    </TransactionButton>
  );
}