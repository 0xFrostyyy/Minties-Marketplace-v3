"use client";
import { NFT as NFTType } from "thirdweb";
import { TransactionButton } from "thirdweb/react";
import { useRouter } from "next/navigation";
import { createAuction } from "thirdweb/extensions/marketplace";
import { MARKETPLACE, NFT_COLLECTION } from "@/const/contracts";
import toastStyle from "@/util/toastConfig";
import toast from "react-hot-toast";

export default function AuctionListingButton({
	nft,
	minimumBidAmount,
	buyoutBidAmount,
}: {
	nft: NFTType;
	minimumBidAmount: string;
	buyoutBidAmount: string;
}) {
	const router = useRouter();
	return (
		<TransactionButton
			transaction={() => {
				return createAuction({
					contract: MARKETPLACE,
					assetContractAddress: NFT_COLLECTION.address,
					tokenId: nft.id,
					minimumBidAmount,
					buyoutBidAmount,
				});
			}}
			onTransactionSent={() => {
				toast.loading("Listing...", {
					id: "auction",
					style: toastStyle,
					position: "bottom-center",
				});
			}}
			onError={(error) => {
				toast(`Listed Failed! Reason: ${error.cause}`, {
					icon: "❌",
					id: "auction",
					style: toastStyle,
					position: "bottom-center",
				});
			}}
			onTransactionConfirmed={(txResult) => {
				toast("Listed Successfully!", {
					icon: "🥳",
					id: "auction",
					style: toastStyle,
					position: "bottom-center",
				});
				router.push(
					`/token/${NFT_COLLECTION.address}/${nft.metadata.id}`
				);
			}}
		>
			List for Auction
		</TransactionButton>
	);
}
