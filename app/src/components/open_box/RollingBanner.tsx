import gsap from 'gsap';
import { useEffect, useRef } from "react";
import { OpenedPrize } from "@/types";

const NFT_ID_PREFIX = "nft_item";

const RollingBanner = ({ prizes, winnerIndex }: { prizes: OpenedPrize[], winnerIndex: number }) => {
  if (winnerIndex >= prizes.length) throw new Error("winnerIndex must be less than prizes.length");
  const bannerWrapper = useRef<HTMLDivElement>(null);
  const rollerContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (rollerContainer.current !== null && bannerWrapper.current !== null && winnerIndex !== -1) {
      const nftWidth = rollerContainer.current.children[0].clientWidth + 75;
      bannerWrapper.current.style.width = `${nftWidth * 3}px`;

      // shuffle and duplicate prizes
      // const shuffledPrizes = [...Array(10 * prizes.length)]
      //   .map((_, i) => prizes[i % prizes.length])
      //   .sort(() => Math.random() - 0.5);

      const duplicatedPrizes = Array.from({ length: prizes.length * 11 }, (_, i) => prizes[i % prizes.length]);
      const winningPrizeIndex = winnerIndex + prizes.length * 10;
      // console.log(winnerIndex, prizes.length, winningPrizeIndex);
      // append duplicated prizes to roller container
      duplicatedPrizes.forEach((prize, nftIdIndex) => {
        const nftItem = document.createElement("div");
        nftItem.id = NFT_ID_PREFIX + (nftIdIndex + prizes.length);
        nftItem.className = "w-[100px] h-[100px] rounded-md bg-no-repeat bg-center bg-cover transition-all duration-[1s]";
        nftItem.style.backgroundImage = `url(${prize.image})`;
        // @ts-ignore
        rollerContainer.current.appendChild(nftItem);
      })

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
          const nftItem = rollerContainer.current.children[winningPrizeIndex];
          nftItem.classList.add("scale-[2]");
          nftItem.classList.add("-translate-y-[30%]");          
          // @ts-ignore
          nftItem.style.boxShadow = `0 0 20px 18px ${getRarityColor()}`;
        }
      })

    }
  }, [prizes, winnerIndex])

  return (
    <div className={"absolute z-10 top-8 flex flex-col w-full place-items-center gap-5"}>
      <div id={"banner-wrapper"} ref={bannerWrapper} className={`relative flex place-items-center overflow-hidden h-[350px]`}>
        {/* <div className='absolute z-[100] left-8 bottom-[60px] w-20 h-[100px] bg-gradient-to-r from-[#0A0C1C] via-50%'></div> */}
        <div className='absolute z-[100] -left-[110px] bottom-10 w-[200px] h-[220px] bg-[#120D17] blur-xl'></div>
        <div className='absolute z-[100] -right-[110px] bottom-10 w-[200px] h-[220px] bg-[#100C16] blur-xl'></div>
        <div id={"roller-container"} ref={rollerContainer} className={"flex opacity-0 gap-20 w-[9999999999px] h-[100px] mt-0 ml-8"}>
          {
            prizes.map((prize, nftIdIndex) => (
              // <Image id={`${NFT_ID_PREFIX + nftIdIndex}`} key={nftIdIndex} src={prize.image} alt={`nft-${nftIdIndex}`} width={130} height={130} className={"aspect-square rounded-md transition-all duration-[1s]"} />
              <div key={nftIdIndex} id={`${NFT_ID_PREFIX + nftIdIndex}`} className={"w-[100px] h-[100px] rounded-md bg-no-repeat bg-center bg-cover transition-all duration-[1s]"} style={{ backgroundImage: `url(${prize.image})` }}></div>
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default RollingBanner;