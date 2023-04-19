import React from 'react';
import Image from "next/image";
import { LazyLoadImage } from 'react-lazy-load-image-component';

interface PrizeItemProps {
  icon: string;
  title: string;
  box: string;
  value?: number;
  rarity: number;
}

export const PrizeItem: React.FC<PrizeItemProps> = ({ icon, title, box, value, rarity }) => {
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

  return (
    <div className={"flex w-[300px] box-content rounded-[10px] bg-[#28282840] p-2 gap-5 transition-all duration-300 " + getRarityBoxShadowClass()}>
      <div className={"rounded-[5px] overflow-hidden w-[72px] h-[72px] " + getRarityShadowClass()}>
        {icon && <LazyLoadImage
          src={icon}
          height={72}
          className='w-full h-auto aspect-square object-cover'
          effect='blur'
        />}
      </div>
      <div className="flex flex-col justify-center">
        <p className="bg-clip-text text-transparent font-[700] font-aber-mono leading-tight bg-gradient-card-title truncate w-[208px]">{title}</p>
        <p className="text-[#65666B] text-[11px]">{box}</p>
        <div className="mt-auto flex place-items-center gap-1.5">
          <Image width={12} height={11} className="w-[12px] h-[11px] mt-[-3px]" src="/images/solana.svg" alt="solana" />
          <p className="text-[13px] font-[700] font-aber-mono leading-tight">{value ? `${value.toLocaleString('en-us', { maximumFractionDigits: 2 })} SOL Value` : '-'}</p>
        </div>
      </div>
    </div>
  );
};