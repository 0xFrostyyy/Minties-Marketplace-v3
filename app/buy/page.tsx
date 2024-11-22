export const dynamic = "force-dynamic";
export const revalidate = 0;
import React, { Suspense } from "react";
import { NFTGridLoading } from "@/components/NFT/NFTGrid";
import ListingGrid from "@/components/ListingGrid/ListingGrid";
import { MARKETPLACE, NFT_COLLECTION } from "@/const/contracts";

export default function Buy() {
	return (
		<div className="">
			<h1 className="text-4xl text-[#EDFFFF]">Trade Your Tokens for Jungle Treasures! Use your hard-earned tokens to claim exclusive items and unlock the wonders of the Minties jungle!</h1>

			<div className="my-8">
				<Suspense fallback={<NFTGridLoading />}>
					<ListingGrid
						marketplace={MARKETPLACE}
						collection={NFT_COLLECTION}
						emptyText={
							"It looks like there are no items swinging through the marketplace yet!"
						}
					/>
				</Suspense>
			</div>
		</div>
	);
}
