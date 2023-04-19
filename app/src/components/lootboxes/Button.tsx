import React from "react";
import Image from "next/image";

interface ButtonProps {
  text: string;
  handler?: () => void;
  startIconUrl?: string;
}

export const Button: React.FC<ButtonProps> = ({text, handler, startIconUrl}) => {
  return (
    <div className="relative flex cursor-pointer place-items-center justify-center border-none text-center uppercase text-white transition-all duration-300 bg-gradient-button m-2.5 px-[25px] py-[6px] bg-[200%_auto] rounded-[5px] gap-[8px] hover:bg-right-center" onClick={handler}>
      {
        startIconUrl &&
        <Image width={19} height={19} className="absolute w-[19px] h-[19px] left-[8px]" src={startIconUrl} alt=""/>
      }
      <p className={`mb-[-3px] font-aber-mono text-[12px] ${startIconUrl ? "ml-[16px]" : ""}`}>{text}</p>
    </div>
  );
}