import React from "react";

interface NftCardProps {
  image?: string;
  price: number;
  symbol?: string;
}

const NftCard: React.FC<NftCardProps> = ({image, price, symbol}) => {
  return (
    <div className={"flex flex-col justify-end bg-cover bg-center bg-no-repeat rounded-xl w-[150px] h-[180px]"}
         style={{backgroundImage: `url(${image})`}}>
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