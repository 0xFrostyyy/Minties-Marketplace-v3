import type { NextPage } from "next";
import Link from "next/link";
import Image from "next/image";

/**
 * Landing page with a simple gradient background and a hero asset.
 * Free to customize as you see fit.
 */
const Home: NextPage = () => {
  return (
    <div className="">
      <div className="flex justify-center p-2">
        <Image
          src="/Twitter_profile_picccc_1.png"
          width={540}
          height={540}
          alt="Hero asset, NFT marketplace"
          quality={100}
          className="max-w-screen mb-4"
        />
      </div>
      <div className="px-8 mx-auto text-center">
        <h1 className="mb-5 text-black font-bold md:text-6xl text-[#EDFFFF] ">
          <span className="text-[#EDFFFF]">
						Minties Marketplace
          </span>
        </h1>
        <p className="text-[#EDFFFF] text-[1.2rem] max-w-xl mx-auto">
          Step into the jungle&apos;s trading hub, where tokens turn into treasures! 
          <br />
          Explore rare items, unlock hidden wonders, and gear up for your Minties adventure.
        </p>

        <div className="flex justify-center text-lg font-medium items-center mt-12 gap-4">
          <Link
            className="w-56 p-3 rounded-lg transition-all text-black bg-[#EED3B1] border-white/10 border"
            href="https://discord.gg/minties"
            target="_blank"
          >
						Discord
          </Link>
          <Link
            className="w-56 p-3 rounded-lg transition-all text-black bg-[#EED3B1] border-white/10 border"
            href="https://twitter.com/Seiminties"
            target="_blank"
          >
						Twitter
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
