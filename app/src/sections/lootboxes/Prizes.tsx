import React from 'react';
import {PrizeItem} from "@/components/lootboxes/PrizeItem";
import {Swiper, SwiperSlide} from "swiper/react";
import {FreeMode} from "swiper";

export const Prizes: React.FC = () => {
  const [slidesPerView, setSlidesPerView] = React.useState(4)
  const [prizes, setPrizes] = React.useState<{rarity: string, title: string, box: string, value: number}[]>([])

  React.useEffect(() => {
    for (let i = 0; i < 4; i++) {
      setPrizes(prevState => [...prevState, {
        rarity: 'legendary',
        title: `Ukiyo 1/1 #${i}`,
        box: 'Zen Box',
        value: 20
      }])
    }
  }, [])

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      if (innerWidth < 768) {
        setSlidesPerView(1)
      } else if (innerWidth < 1024) {
        setSlidesPerView(2)
      } else if (innerWidth < 1280) {
        setSlidesPerView(3)
      } else {
        setSlidesPerView(4)
      }
    }
  }, [])

  return (
    <div className="my-5">
      <h1 className="mb-5 banner-text">Winnable Prizes</h1>
      <Swiper freeMode={true} spaceBetween={-50} slidesPerView={slidesPerView} modules={[FreeMode]} className={"prizes-wrapper"}>
        {
          prizes.map((prize, index) => (
            <SwiperSlide key={index}>
              <PrizeItem rarity={prize.rarity} icon={"/images/001.png"} title={prize.title} box={prize.box} value={prize.value}/>
            </SwiperSlide>
          ))
        }
      </Swiper>
    </div>
  );
};