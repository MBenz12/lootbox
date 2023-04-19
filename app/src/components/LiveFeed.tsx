/* eslint-disable @next/next/no-img-element */
import { motion } from "framer-motion";
import { Event } from '@/types';
import { useState } from 'react';
import moment from 'moment';

const LiveFeedItem = ({ name, box, img, time }: {
  name: string;
  box: string;
  img: string;
  time: string;
}) => {
  const liveFeedItemDivider = "after:absolute after:bottom-0 after:left-0 after:right-0 after:w-[100%] after:h-[2px] after:bg-gradient-purple-divider"
  return (
    <div className={"flex flex-col place-items-center relative mt-6 justify-center " + liveFeedItemDivider}>
      <img width={130} height={130} src={img} alt={name} className={"w-[130px] h-[130px] rounded-[5px]"} />
      <div className={"flex flex-col w-[130px] overflow-hidden my-2"}>
        <p className={"opacity-50 text-[13px]"}>{box} Box</p>
        <p className={"text-[14px]"}>{name}</p>
        <p className={"opacity-50 text-[12px] my-2"}>{time}</p>
      </div>
    </div>
  );
};

const LiveFeed = ({ events }: { events: Array<Event> }) => {
  const [opened, setOpened] = useState(false);
  const liveFeedDivider = "after:absolute after:bottom-0 after:left-0 after:right-0 after:w-[100%] after:h-[2px] after:bg-gradient-white-divider"

  return (
    <div className={"fixed right-0 bottom-0 w-[200px] bg-[#191B34] z-10 rounded-tl-[15px]"}>
      <div className={"relative flex cursor-pointer place-items-center justify-start gap-3 px-8 py-3 " + liveFeedDivider}
        onClick={() => setOpened(!opened)}>
        <div className={"pulsating-circle"}></div>
        <h1 className='font-aber-mono'>Live Feed</h1>
      </div>
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: opened ? "auto" : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={"flex flex-col my-3 place-items-center justify-center gap-3"}>
        <div className={"max-h-[75vh] w-full overflow-y-auto"}>
          {events.map((item, index) => (
            <LiveFeedItem key={index} name={item.name || item.symbol || ''} box={item.lootboxName} img={item.image} time={moment(new Date(item.timestamp * 1000)).fromNow()} />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default LiveFeed;