/* eslint-disable @next/next/no-img-element */
import React from "react";
import { LazyLoadImage } from 'react-lazy-load-image-component';

interface SelectableNftProps {
  image: string;
  selected: boolean;
  handleSelect: () => void;
  floorPrice?: number;
}

const SelectableNft: React.FC<SelectableNftProps> = ({ image, handleSelect, selected, floorPrice }) => {
  return (
    <div className='cursor-pointer flex flex-col'>
      <div onClick={handleSelect} className={"relative overflow-hidden w-[150px] h-[150px] rounded-xl"}>
        <LazyLoadImage
          src={image}
          className='rounded-xl object-cover'
          effect='blur'
        />
        {selected && <div className={"absolute w-[20px] h-[20px] rounded-full border border-[rgba(0,0,0,.5)] top-2 right-2 bg-[#9945FF]"} />}
      </div>
      <div className='text-white text-center w-[150px]'>{floorPrice !== undefined ? `${floorPrice.toLocaleString('en-us', { maximumFractionDigits: 2 })} SOL` : ''}</div>
    </div>
  );
};

export default SelectableNft;