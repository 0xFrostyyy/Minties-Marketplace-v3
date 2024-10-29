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
        <h1 className="mb-5 text-white font-bold md:text-6xl">
          <span className="text-transparent bg-clip-text gradient">
						One Stop Marketplace
          </span>
          <br />
					Unique Offers
        </h1>
        <p className="text-white/60 text-lg max-w-xl mx-auto">
					Special place to buy unique and limited items from the marketplace using or own tokens!
        </p>

        <div className="flex justify-center text-lg font-medium items-center mt-12 gap-4">
          <Link
            className="w-56 p-3 rounded-lg transition-all hover:shadow-lg gradient border-white/10 border"
            href="https://discord.gg/minties"
            target="_blank"
          >
						Discord
          </Link>
          <Link
            className="w-56 p-3 rounded-lg bg-white/[.04] transition-all hover:bg-white/[.06] border-white/10 border"
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
