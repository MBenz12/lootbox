import { ReactNode, useEffect, useRef, useState } from "react";
import { Button } from "@/components/open_box/Button";
import Image from "next/image";
import { motion } from "framer-motion";
import { OpenedPrize } from "@/types";
import RollingBanner from "@/components/open_box/RollingBanner";

type Props = {
  children: ReactNode;
  boxName: string;
  boxNameColor?: string;
  prizes: OpenedPrize[];
  openedPrize?: OpenedPrize;
  isRoll: boolean;
  openButtonHandler: () => void;
  boxPrice: number;
}

const BoxWrapper = ({children, boxName, boxNameColor="#fff", prizes, openedPrize, isRoll, openButtonHandler, boxPrice}: Props) => {
  const divider = "after:absolute after:bottom-0 after:left-0 after:right-0 after:w-[100%] after:h-[2px] after:bg-gradient-purple-divider"
  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [canvasHeight, setCanvasHeight] = useState(0);
  useEffect(() => {
    if (canvasRef.current) {
      setCanvasWidth(canvasRef.current.clientWidth);
      setCanvasHeight(canvasRef.current.clientHeight);
    }    
  }, [canvasRef]);
  

  return (
    <div ref={canvasRef} className={"relative flex flex-col justify-center place-items-center w-full h-auto min-h-[300px] mb-10 overflow-hidden " + divider}>
      <div className={"flex gap-2.5 font-[800] text-5xl uppercase"}>
        <p className={"font-akira"} style={{color: boxNameColor}}>{boxName}</p>
        <p className={"font-akira"}>BOX</p>
      </div>
      {children}

      {isRoll && <RollingBanner prizes={prizes} winnerIndex={
        prizes.findIndex(prize => prize.image === openedPrize?.image && prize.rarity === openedPrize.rarity)
      } />}

      <div className={"flex flex-col place-items-center my-5"}>
        <Button text={"Open"} handler={openButtonHandler} />
        <div className={"flex gap-1 place-items-center"}>
          <Image width={18} height={18} src="/images/coin.png" alt="coin" />
          <p className={"opacity-50"}>{boxPrice} ZEN</p>
        </div>
      </div>

      {/* Background particles */}
      {
        canvasRef.current &&
        Array.from({ length: 80 }).map((_, i) => (
          <motion.span
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: [0, 1, 0],
            }}
            transition={{
              delay: Math.random() * 2,
              duration: 3 + Math.random() * 5,
              repeat: Infinity
            }}
            style={{
              top: Math.random() * canvasHeight,
              left: Math.random() * canvasWidth,
              width: 4,
              height: 4,
              zIndex: -1
            }}
            className={"absolute bg-white rounded-full"}
            key={i}
          />
        ))
      }

    </div>
  );
};

export default BoxWrapper;