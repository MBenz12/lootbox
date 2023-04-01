import { useEffect, useState } from 'react';
import { PrizeItem } from "@/components/lootboxes/PrizeItem";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper";
import { WinnablePrize } from '@/types';

export const Prizes = ({ prizes }: { prizes: Array<WinnablePrize> }) => {
  const [slidesPerView, setSlidesPerView] = useState(4)
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (innerWidth < 768) {
        setSlidesPerView(1)
      } else if (innerWidth < 1024) {
        setSlidesPerView(2)
      } else if (innerWidth < 1280) {
        setSlidesPerView(3)
      } else if (innerWidth < 1600) {
        setSlidesPerView(4)
      } else {
        setSlidesPerView(6)
      }
    }
  }, []);

  return (
    <div className="my-5">
      <h1 className="mb-5 banner-text">Winnable Prizes</h1>
      <Swiper freeMode={true} spaceBetween={20} slidesPerView={slidesPerView} modules={[FreeMode]} className={"prizes-wrapper"}>
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