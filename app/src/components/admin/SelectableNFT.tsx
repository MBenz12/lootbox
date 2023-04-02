/* eslint-disable @next/next/no-img-element */
import React from "react";
import { LazyLoadImage } from 'react-lazy-load-image-component';

interface SelectableNftProps {
  image: string;
  selected: boolean;
  handleSelect: () => void;
}

const SelectableNft: React.FC<SelectableNftProps> = ({ image, handleSelect, selected }) => {
  return (
    <div onClick={handleSelect} className={"relative overflow-hidden cursor-pointer w-[150px] h-[150px] rounded-xl"}>
      <LazyLoadImage
        src={image}
        className='rounded-xl object-cover'
        effect='blur'
      />
      {selected && <div className={"absolute cursor-pointer w-[20px] h-[20px] rounded-full border border-[rgba(0,0,0,.5)] top-2 right-2 bg-[#9945FF]"} />}
    </div>
  );
};

export default SelectableNft;