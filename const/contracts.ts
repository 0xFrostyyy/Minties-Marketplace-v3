import client from "@/lib/client";
import { getContract } from "thirdweb";
import { defineChain } from "thirdweb/chains";

// Import the ABI
import marketplaceABI from "@/abis/Marketplace.json";
import nftCollectionABI from "@/abis/NFTCollection.json";

const SeiNetwork = defineChain({
    id: 1329,
    rpc: 'https://sei-evm-rpc.publicnode.com/',
      nativeCurrency: {
      name: "SEI",
      symbol: "SEI",
      decimals: 18,
    },
});

export const NETWORK = SeiNetwork;

export const MARKETPLACE = getContract({
  address: "0x82CEB90fe3b398B622397E9F19592dE4F4F80988",
  client,
  chain: NETWORK,
  abi: marketplaceABI as any,
});

export const NFT_COLLECTION = getContract({
  address: "0xeA6573Bc72C87C59998A22d5A9a59e1AA5866Bd5",
  client,
  chain: NETWORK,
  abi: nftCollectionABI as any,
});

export const ETHERSCAN_URL = "https://seitrace.com/";

export const ALLOWED_WALLETS = [
  "0xeb029Ebe06ab0BF3303aA4f6382B402ba640bB67",
  "0xb4D5cd76A19adf9E51F1b78fa948a7f5570DAE98",
];