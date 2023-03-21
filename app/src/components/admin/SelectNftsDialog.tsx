import React from "react";
import SelectableNFT from "./SelectableNFT";
import Button from "./Button";

interface SelectNftsDialogProps {
  show: boolean;
  toggleShow: () => void;
}

const SelectNftsDialog: React.FC<SelectNftsDialogProps> = ({show, toggleShow}) => {
  const nfts = [
    {
      id: 1,
      image: "/images/002.jpg"
    },
    {
      id: 2,
      image: "/images/002.jpg"
    },
    {
      id: 3,
      image: "/images/002.jpg"
    },
    {
      id: 4,
      image: "/images/002.jpg"
    },
  ];

  const [selectedNfts, setSelectedNfts] = React.useState<number[]>([]);
  const handleSelectNft = (index: number) => {
    if (selectedNfts.includes(index))
      setSelectedNfts(selectedNfts.filter((item) => item !== index));
    else
      setSelectedNfts([...selectedNfts, index]);
  }
  const isSelected = (index: number) => selectedNfts.includes(index);

  if (!show) return null;
  return (
    <div className={"fixed z-20 flex justify-center place-items-center top-0 left-0 w-full h-full bg-[rgba(0,0,0,.9)]"} onClick={toggleShow}>
      <div className={"mx-28 border border-white rounded-xl w-full"} onClick={(e) => e.stopPropagation()}>
        <div className={"flex gap-5 my-5 ml-5"}>
          <p className={"text-[24px] font-bold"}>Adding NFTs ({selectedNfts.length})</p>
          <Button text={"Submit"} onClick={() => alert("Submit adding nfts handler")}/>
        </div>
        <div className={"grid grid-cols-[repeat(auto-fill,_minmax(150px,_1fr))] overflow-y-auto overflow-x-hidden gap-2 w-full h-[400px] p-5"}>
          {
            nfts.map((nft, index) => (
              <SelectableNFT key={index} selected={isSelected(index)} handleSelect={() => handleSelectNft(index)} image={nft.image}/>
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default SelectNftsDialog;