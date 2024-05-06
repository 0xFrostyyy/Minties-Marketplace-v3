"use client";
import { useRouter } from "next/navigation";
import { NFT as NFTType } from "thirdweb";
import { TransactionButton } from "thirdweb/react";
import { createListing } from "thirdweb/extensions/marketplace";
import toast from "react-hot-toast";
import { MARKETPLACE, NFT_COLLECTION } from "@/const/contracts";
import toastStyle from "@/util/toastConfig";

export default function DirectListingButton({
	nft,
	pricePerToken,
}: {
	nft: NFTType;
	pricePerToken: string;
}) {
	const router = useRouter();
	return (
		<TransactionButton
			transaction={() => {
				return createListing({
					contract: MARKETPLACE,
					assetContractAddress: NFT_COLLECTION.address,
					tokenId: nft.id,
					pricePerToken,
				});
			}}
			onTransactionSent={() => {
				toast.loading("Listing...", {
					id: "direct",
					style: toastStyle,
					position: "bottom-center",
				});
			}}
			onError={(error) => {
				toast(`Listed Failed!`, {
					icon: "❌",
					id: "direct",
					style: toastStyle,
					position: "bottom-center",
				});
			}}
			onTransactionConfirmed={(txResult) => {
				console.log(txResult);
				toast("Listed Successfully!", {
					icon: "🥳",
					id: "direct",
					style: toastStyle,
					position: "bottom-center",
				});
				router.push(
					`/token/${NFT_COLLECTION.address}/${nft.id.toString()}`
				);
			}}
		>
			List for Sale
		</TransactionButton>
	);
}
