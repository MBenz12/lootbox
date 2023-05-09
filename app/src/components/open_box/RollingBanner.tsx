/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import gsap from 'gsap';
import { useEffect, useRef, useState } from "react";
import { WinnablePrize } from "@/types";
import { Rarity } from "@/lootbox-program-libs/types";
import { isToken } from '@/utils';

const NFT_ID_PREFIX = "nft_item";

const RollingBanner = ({ prizes, winnerIndex, rolling, onComplete, rarities }: { prizes: WinnablePrize[], winnerIndex: number, rolling: boolean, onComplete: () => void, rarities?: Rarity[] }) => {
  if (winnerIndex >= prizes.length) throw new Error("winnerIndex must be less than prizes.length");
  const bannerWrapper = useRef<HTMLDivElement>(null);
  const rollerContainer = useRef<HTMLDivElement>(null);
  const [rollerPrizes, setRollerPrizes] = useState<Array<WinnablePrize>>(prizes);

  const getRarityName = (rarity: number) => {
    return [
      "Common",
      "Uncommon",
      "Rare",
      "Legendary"
    ][rarity];
  }

  const getRarityColorClass = (rarity: number) => {
    return [
      "bg-common-card",
      "bg-uncommon-card",
      "bg-rare-card",
      "bg-legendary-card"
    ][rarity];
  }

  useEffect(() => {
    if (rollerContainer.current !== null && bannerWrapper.current !== null && winnerIndex !== -1 && rolling) {
      const nftWidth = rollerContainer.current.children[0].clientWidth + 75;
      bannerWrapper.current.style.width = `${nftWidth * 3}px`;
      // append duplicated prizes to roller container
      const times = Math.floor(150 / prizes.length);
      const winningPrizeIndex = winnerIndex + (times - 1) * prizes.length;
      const duplicatedPrizes = Array.from({ length: prizes.length * times }, (_, i) => prizes[i % prizes.length]);
      setRollerPrizes(duplicatedPrizes);
      console.log(winnerIndex, prizes.length, winningPrizeIndex);

      // animate rolling process
      const tl = gsap.timeline();
      tl.to(rollerContainer.current, {
        opacity: 1,
        duration: 0.8,
        ease: "linear"
      })
      tl.to(rollerContainer.current, {
        // calculate the offset of the winning prize
        x: -(nftWidth + 5) * (winningPrizeIndex - 1),
        delay: 0.5,
        duration: 5,
        ease: "circ.inOut",
        onComplete: () => {
          if (rollerContainer.current === null) return;
          const getRarityColor = () => {
            return [
              "#343751",
              "#4693DA",
              "#ED9A1F",
              "#FF7CFA"
            ][prizes[winnerIndex]?.rarity || 0];
          };
          const nftContainer = rollerContainer.current.children[winningPrizeIndex];
          const nftItem = rollerContainer.current.children[winningPrizeIndex].children[0];
          const nftName = rollerContainer.current.children[winningPrizeIndex].children[1];
          const nftRarity = rollerContainer.current.children[winningPrizeIndex].children[2];
          const nftPrize = rollerContainer.current.children[winningPrizeIndex].children[3];
          nftContainer.classList.add("scale-[1.5]");
          nftContainer.classList.add("backdrop-blur-3xl");
          nftContainer.classList.add("-translate-y-5");
          nftName.classList.add("opacity-100")
          nftRarity.classList.add("opacity-100")
          nftPrize.classList.add("opacity-100")
          // @ts-ignore
          nftContainer.style.boxShadow = `0px -2px 40px 2px ${getRarityColor()}`
          // @ts-ignore
          nftItem.style.boxShadow = `0px 5px 40px 10px ${getRarityColor()}`;
          onComplete();
        }
      })

    }
  }, [rolling])

  return (
    <div className={"absolute z-30 top-8 flex flex-col w-full place-items-center gap-5 roller"}>
      <div id={"banner-wrapper"} ref={bannerWrapper} className={`relative flex place-items-center overflow-hidden h-[380px]`}>
        {/* <div className='absolute z-[100] left-8 bottom-[60px] w-20 h-[120px] bg-gradient-to-r from-[#0A0C1C] via-50%'></div> */}
        <div className='absolute z-[100] -left-[110px] bottom-10 w-[200px] h-[300px] bg-[#0b0c1a] blur-xl'></div>
        <div className='absolute z-[100] -right-[110px] bottom-10 w-[200px] h-[300px] bg-[#0b0c1a] blur-xl'></div>
        <div id={"roller-container"} ref={rollerContainer} className={"flex opacity-0 gap-20 w-[9999999999px] h-[120px] mt-5 ml-8"}>
          {
            rollerPrizes.map((prize, nftIdIndex) => (
              <div id={"prize-container"} key={nftIdIndex} className={"flex flex-col place-items-center rounded-lg w-[130px] h-[170px] pt-[5px] transition-all duration-[1s]"}>
                <div id={`${NFT_ID_PREFIX + nftIdIndex}`} className={"w-[120px] h-[120px] rounded-md bg-no-repeat bg-center bg-cover transition-all duration-[1s]"} style={{ backgroundImage: `url(${prize.image})` }}></div>
                <p className={"opacity-0 transition-all duration-[3s] text-[11px] mt-[4px] p-1 w-full truncate"}>{isToken(prize.name) ? `${prize.value} ` : ''}{prize.name}</p>
                <p className={`opacity-0 transition-all duration-[3s] text-[7px] mt-1 ${getRarityColorClass(prize.rarity)} px-1.5 py-[1px] rounded-md`}>{getRarityName(prize.rarity)} {rarities && rarities[prize.rarity].dropPercent / 100}%</p>
                <div className={"absolute right-2 top-2 opacity-0 transition-all duration-[3s] bg-[#C8C8C8] rounded-[4px] py-[2px] px-[4px] flex justify-items-center gap-[2px]"}>
                  <img src="/images/solana.svg" alt='' />
                  <p className='text-black text-[8px] font-bold'>{(isToken(prize.name) && prize.name !== 'SOL') ? '-' : prize.value.toLocaleString('en-us', { maximumFractionDigits: 3 })} SOL</p>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default RollingBanner;