/* eslint-disable @next/next/no-img-element */
import React from "react";
import {Button} from "./Button";
import {motion} from "framer-motion";
import Image from "next/image";

interface BoxItemProps {
  name: string;
  nameColor: string;
  shadowColor?: string;
  description: string;
  price: number;
  handleClick?: () => void;
  opening?: boolean;
}

const BoxItem: React.FC<BoxItemProps> = ({name, nameColor, shadowColor,  opening, description, price, handleClick}) => {
  const renderButton = () => {
    if (opening) {
      return <Button text={"OPENING BOX..."}/>
    }
    if (price > 0) {
      return <Button text={`${price} ZEN`} startIconUrl={"/images/coin.png"} handler={handleClick}/>
    }
    return <Button text={"Free"} handler={handleClick}/>
  }

  return (
    <motion.div
      whileHover={{
        boxShadow: `0 0 20px 1px ${shadowColor}`,
      }}
      transition={{
        delay: 0,
        duration: 0.3,
      }}
      className="group w-[290px] h-[320px] p-[2px] rounded-[15px] backdrop-blur-[25px] bg-gradient-box-fill border-[3px] border-[rgba(255,255,255,0.15)]"
    >
      <div className="transition-all duration-300 group-hover:scale-[1.1] relative -top-20 flex justify-center">
        <Image width={260} height={240} src="/images/box1.png" alt="box1"/>
      </div>
      <div className="px-5 text-center mt-[-110px]">
        <p className="my-2 banner-text text-[32px] font-akira uppercase font-[800] scale-y-[0.75]"><span style={{color: nameColor}} className="banner-text font-akira uppercase font-[800] scale-y-[0.75]">{name}</span> Box</p>
        {
          opening
            ?
            <div className={"flex justify-center"}>
              <motion.div
                animate={{rotate: 360}}
                transition={{duration: 1.5, repeat: Infinity, ease: "linear"}}
                className={"load-circle"}
              ></motion.div>
            </div>
            :
            <p className="text-[11px] font-aber-mono text-[#65666B]">{description}</p>
        }
      </div>
      <div className="flex justify-center pt-5">
        {
          renderButton()
        }
      </div>
    </motion.div>
  );
};

export default BoxItem;