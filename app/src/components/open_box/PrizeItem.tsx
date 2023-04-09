import React from "react";
import Image from "next/image";

interface PrizeItemProps {
  icon: string;
  title: string;
  value?: number;
  rarity: number;
  dropRate: number;
}

export const PrizeItem: React.FC<PrizeItemProps> = ({icon, title, value, rarity, dropRate}) => {
  const getRarityShadowClass = () => {
    return [
      "drop-shadow-common-card",
      "drop-shadow-uncommon-card",
      "drop-shadow-rare-card",
      "drop-shadow-legendary-card"
    ][rarity];
  }

  const getRarityBoxShadowClass = () => {
    return [
      "hover:shadow-common-card",
      "hover:shadow-uncommon-card",
      "hover:shadow-rare-card",
      "hover:shadow-legendary-card"
    ][rarity];
  }

  const getRarityName = () => {
    return [
      "Common",
      "Uncommon",
      "Rare",
      "Legendary"
    ][rarity];
  }

  const getRarityColorClass = () => {
    return [
      "bg-common-card",
      "bg-uncommon-card",
      "bg-rare-card",
      "bg-legendary-card"
    ][rarity];
  }

  return (
    <div className={`flex w-[280px] box-content rounded-[10px] bg-[#28282840] p-2 gap-5 transition-shadow duration-300 ` + getRarityBoxShadowClass()}>
      <div className={"bg-cover bg-center bg-no-repeat rounded-[5px] w-[90px] h-[90px] aspect-square " + getRarityShadowClass()} style={{backgroundImage: `url(${icon})`}}></div>
      <div className="flex flex-col justify-center">
        <p className="bg-clip-text text-transparent text-[16px] bg-gradient-card-title">{title}</p>
        <p className={"w-fit px-1 mt-1 rounded-lg text-[11px] " + getRarityColorClass()}>{getRarityName()} {dropRate}%</p>
        <div className="mt-auto flex place-items-center gap-1.5">
          <Image width={12} height={11} className="w-[12px] h-[11px]" src="/images/solana.svg" alt="solana"/>
          <p className="text-[15px]">{value !== undefined ? `${value.toLocaleString('en-us', { maximumFractionDigits: 2 })} SOL Value` : '-'}</p>
        </div>
      </div>
    </div>
  );
};