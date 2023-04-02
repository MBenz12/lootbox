import { PrizeItem } from "@/components/lootboxes/PrizeItem";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper";
import { WinnablePrize } from '@/types';

export const Prizes = ({ prizes }: { prizes: Array<WinnablePrize> }) => {
  return (
    <div className="my-5">
      <h1 className={"font-akira font-[800] uppercase text-xl my-5"} style={{transform: "scaleY(75%)"}}>Winnable Prizes</h1>
      <Swiper freeMode={true} spaceBetween={15} slidesPerView="auto" modules={[FreeMode]} className={"prizes-wrapper"}>
        {
          prizes.map((prize, index) => (
            <SwiperSlide key={index}>
              <PrizeItem rarity={prize.rarity} icon={prize.image} title={prize.name} box={prize.lootbox} value={prize.value} />
            </SwiperSlide>
          ))
        }
      </Swiper>
    </div>
  );
};