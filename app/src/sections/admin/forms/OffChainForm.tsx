import React from "react";
import Button from "../../../components/admin/Button";
import Input from "../../../components/admin/Input";
import Image from "next/image";
import { OffChainPrize } from '@/types';
import ImageDropdown from '@/components/admin/ImageDropdown';

const OffChainForm = ({
  currentRarity,
  prizeItems,
  prizes,
  setCurrentRarity,
  handleOpenDialog,
  setPrizes,
  handleRemovePrize,
}: {
  currentRarity: number,
  prizeItems: Array<OffChainPrize>,
  prizes: Array<Array<OffChainPrize>>,
  setCurrentRarity: (rarity: number) => void,
  handleOpenDialog: (show: boolean) => void,
  setPrizes: (prizes: Array<Array<OffChainPrize>>) => void,
  handleRemovePrize: (rarity: number, prizeIndex: number) => void
}) => {

  return (
    <div className={"flex flex-col border-2 rounded-2xl border-[rgba(255,255,255,.5)] p-2"}>
      <p className={"text-center mb-1 text-[30px] font-bold"}>Off-Chain Prize</p>
      <div className='flex justify-center'>
        <Button text={"Prizes"} onClick={() => handleOpenDialog(true)} />
      </div>
      <div className={"flex gap-1 justify-center my-4"}>
        {
          ['Common', 'Uncommon', 'Rare', 'Legend'].map((category, index) => {
            return (
              <Button
                key={category + index}
                size={"sm"}
                text={category}
                type={currentRarity === index ? "outline" : "ghost"}
                onClick={() => setCurrentRarity(index)}
              />
            )
          }).reverse()
        }
      </div>
      <div className={"flex gap-1"}>
        <p className={"text-[10px] w-[180px]"}>Prize Item</p>
        <p className={"text-[10px]"}>Total Quantity</p>
      </div>
      {
        prizes[currentRarity].map((prize, index) => {
          return (
            <div key={index} className={"flex gap-1 my-2"}>
              <ImageDropdown
                currentItem={prize}
                items={prizeItems}
                setCurrentItem={(item: OffChainPrize) => {
                  if (prize.lootbox) return;
                  const newPrizes = prizes.map((prizes) => prizes.map(prize => ({ ...prize })));
                  newPrizes[currentRarity][index] = item;
                  setPrizes(newPrizes);
                }}
              />
              <div className='flex flex-col'>
                <Input
                  size={"sm"}
                  type={"number"}
                  onChange={(e) => {
                    if (prize.lootbox) return;
                    const newPrizes = prizes.map((prizes) => prizes.map(prize => ({ ...prize })));
                    newPrizes[currentRarity][index].totalItems = parseInt(e.target.value) || 0;
                    setPrizes(newPrizes);
                  }}
                  value={prize.totalItems || 0}
                  name={`prizes[${index}].total_quantity`}
                />
              </div>

              <div className={"cursor-pointer"} onClick={() => {
                if (prize.lootbox) {
                  handleRemovePrize(currentRarity, index);
                } else {
                  const newPrizes = prizes.map((prizes) => prizes.map(prize => ({ ...prize })));
                  newPrizes[currentRarity].splice(index, 1);
                  setPrizes(newPrizes);
                }
              }}>
                <Image width={18} height={18} className="w-[18px] h-[18px] mt-[5px]" src="/images/remove_icon.svg" alt="remove" />
              </div>
            </div>
          )
        })
      }
      <div className={"flex mt-auto justify-center mb-3"}>
        <p className={"opacity-50 text-[14px] cursor-pointer w-fit"} onClick={() => {
          const newPrizes = prizes.map((prizes) => prizes.map(prize => ({ ...prize })));
          const { name, image } = prizeItems[0];
          newPrizes[currentRarity].push({ index: 0, name, image, });
          setPrizes(newPrizes);
        }}>+ Add New Prize</p>
      </div>
    </div>
  );
};

export default OffChainForm;