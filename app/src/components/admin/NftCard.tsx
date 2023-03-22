import React from "react";
import Image from 'next/image';

interface NftCardProps {
  image?: string;
  price: number;
  symbol?: string;
  handleDelete: () => void;
}

const NftCard: React.FC<NftCardProps> = ({ image, price, symbol, handleDelete }) => {
  return (
    <div className={"relative flex flex-col justify-end bg-cover bg-center bg-no-repeat rounded-xl w-[150px] h-[180px]"}
      style={{ backgroundImage: `url(${image})` }}>
      <div className={"cursor-pointer absolute -top-3 -right-3"} onClick={handleDelete}>
        <Image width={17} height={17} className="w-[17px] h-[17px] mt-0.5" src="/images/close.svg" alt="remove" />
      </div>
      {
        !image && (
          <p className={"flex select-none justify-center place-items-center h-full font-bold bg-white text-black rounded-t-xl"}>{price} {symbol}</p>
        )
      }
      <p className={"text-center text-[12px] py-1 bg-white text-black rounded-b-xl"}>{price ? `${price} SOL` : '-'}</p>
    </div>
  );
};

export default NftCard;