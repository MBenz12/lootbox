import React from "react";
import SelectableNFT from "./SelectableNFT";
import Button from "./Button";
import { NftData } from '@/types';

interface SelectNftsDialogProps {
  nfts: Array<NftData>,
  setOpen: () => void;
  selectedNfts: Array<number>,
  setSelectedNfts: (nfts: Array<number>) => void,
  handleClick: () => void,
  label: string,
}

const SelectNftsDialog: React.FC<SelectNftsDialogProps> = ({ setOpen, nfts, selectedNfts, setSelectedNfts, handleClick, label }) => {
  const isSelected = (index: number) => selectedNfts.includes(index);
  const handleSelectNft = (index: number) => {
    if (selectedNfts.includes(index)) {
      setSelectedNfts(selectedNfts.filter((item) => item !== index));
    }
    else {
      setSelectedNfts([...selectedNfts, index]);
    }
  };
  return (
    <div className={"fixed z-20 flex justify-center place-items-center top-0 left-0 w-full h-full bg-[rgba(0,0,0,.9)]"} onClick={setOpen}>
      <div className={"mx-28 border border-white rounded-xl w-full"} onClick={(e) => e.stopPropagation()}>
        <div className={"flex gap-5 my-5 ml-5"}>
          <p className={"text-[24px] font-bold"}>{label} NFTs ({selectedNfts.length})</p>
          <Button text={label} onClick={handleClick} />
        </div>
        <div className={"grid grid-cols-[repeat(auto-fill,_minmax(150px,_1fr))] overflow-y-auto overflow-x-hidden gap-2 w-full h-[400px] p-5"}>
          {
            nfts.map((nft, index) => (
              <SelectableNFT key={index} selected={isSelected(index)} handleSelect={() => handleSelectNft(index)} image={nft.image} />
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default SelectNftsDialog;