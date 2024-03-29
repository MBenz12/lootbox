import { PrizeItem } from "@/components/lootboxes/PrizeItem";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper";
import { Event } from '@/types';
import useFetchValues from '@/hooks/useFetchValues';

export const RecentlyWonPrizes = ({ events }: { events: Array<Event> }) => {
  const { values } = useFetchValues(events);
  return (
    <div className="my-5">
      <h1 className={"font-akira font-[800] uppercase text-xl my-5 tracking-wider"}>Recently Won Prizes</h1>
      <Swiper freeMode={true} spaceBetween={15} slidesPerView="auto" modules={[FreeMode]} className={"prizes-wrapper"} style={{ padding: '16px' }}>
        {
          events.map((event, index) => (
            <SwiperSlide key={index}>
              <PrizeItem
                rarity={event.rarity}
                icon={event.image}
                title={!event.symbol ? event.name : `${event.amount?.toLocaleString('en-us', { maximumFractionDigits: 3 })} ${event.symbol}`}
                box={event.lootboxName}
                value={values[index]}
              />
            </SwiperSlide>
          ))
        }
      </Swiper>
    </div>
  );
};