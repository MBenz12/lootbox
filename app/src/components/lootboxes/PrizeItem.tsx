import React from 'react';
import Image from "next/image";

interface PrizeItemProps {
  icon: string;
  title: string;
  box: string;
  value: number;
  rarity?: string | "legendary" | "rare" | "uncommon" | "common";
}

export const PrizeItem: React.FC<PrizeItemProps> = ({icon, title, box, value, rarity}) => {
  const getRarityShadowClass = () => {
    switch (rarity) {
      case "legendary":
        return "drop-shadow-legendary-card";
      case "rare":
        return "drop-shadow-rare-card";
      case "uncommon":
        return "drop-shadow-uncommon-card";
      case "common":
        return "drop-shadow-common-card";
      default:
        return "";
    }
  }

  return (
    <div className="flex w-[250px] box-content rounded-[10px] bg-[#28282840] p-2 gap-5">
      <div className={"bg-cover bg-center bg-no-repeat rounded-[5px] w-[72px] h-[72px] " + getRarityShadowClass()} style={{backgroundImage: `url(${icon})`}}></div>
      <div className="flex flex-col justify-center">
        <p className="bg-clip-text text-transparent text-[14px] bg-gradient-card-title">{title}</p>
        <p className="opacity-50 text-[11px]">{box}</p>
        <div className="mt-auto flex place-items-center gap-1.5">
          <Image width={12} height={11} className="w-[12px] h-[11px] mt-[-3px]" src="/images/solana.svg" alt="solana"/>
          <p className="text-[12px]">{value} SOL Value</p>
        </div>
      </div>
    </div>
  );
};