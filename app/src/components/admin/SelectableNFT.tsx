import React from "react";
import Image from "next/image";

interface SelectableNftProps {
  image: string;
  selected: boolean;
  handleSelect: () => void;
}

const SelectableNft: React.FC<SelectableNftProps> = ({image, handleSelect, selected}) => {
  return (
    <div onClick={handleSelect} className={"relative cursor-pointer w-[150px] h-[150px] rounded-xl"}>
      <Image fill className={"rounded-xl object-cover"} src={image} alt="nft_card"/>
      <div className={"absolute cursor-pointer w-[20px] h-[20px] rounded-full border border-[rgba(0,0,0,.5)] top-2 right-2" + (selected ? " bg-[#9945FF]" : " bg-white")}></div>
    </div>
  );
};

export default SelectableNft;