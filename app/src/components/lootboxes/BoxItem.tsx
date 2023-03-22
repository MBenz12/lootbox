/* eslint-disable @next/next/no-img-element */
import React from "react";
import {Button} from "./Button";
import {motion} from "framer-motion";

interface BoxItemProps {
  name: string;
  nameColor: string;
  description: string;
  price: number;
  handleClick?: () => void;
  opening?: boolean;
}

const BoxItem: React.FC<BoxItemProps> = ({name, nameColor, opening, description, price, handleClick}) => {
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
    <div
      className="w-[290px] h-[320px] p-[2px] rounded-[15px] backdrop-blur-[25px] bg-gradient-box-fill border-[3px] border-[rgba(255,255,255,0.15)]">
      <div className="relative -top-20 flex justify-center transition-all duration-300 hover:scale-[1.1]">
        <img src="/images/box1.png" alt="box1"/>
      </div>
      <div className="px-5 text-center mt-[-110px]">
        <p className="my-2 banner-text text-[32px]"><span style={{color: nameColor}} className="banner-text">{name}</span> Box</p>
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
            <p className="opacity-50 text-[12px]">{description}</p>
        }
      </div>
      <div className="flex justify-center pt-5">
        {
          renderButton()
        }
      </div>
    </div>
  );
};

export default BoxItem;