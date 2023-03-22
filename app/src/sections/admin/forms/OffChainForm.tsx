import React from "react";
import Button from "../../../components/admin/Button";
import Input from "../../../components/admin/Input";
import UploadImageInput from "../../../components/admin/UploadImageInput";
import Image from "next/image";
import { OffChainPrize } from '@/types';

const OffChainForm = ({
  currentRarity,
  prizes,
  setCurrentRarity,
  handleOpenDialog,
}: {
  currentRarity: number,
  prizes: Array<OffChainPrize>,
  setCurrentRarity: (rarity: number) => void,
  handleOpenDialog: (show: boolean) => void,
}) => {

  return (
    <div className={"flex flex-col border-2 rounded-2xl border-[rgba(255,255,255,.5)] p-2"}>
      <p className={"text-center mb-1 text-[30px] font-bold"}>Off-Chain Prize</p>
      <div className='flex justify-center mb-2'>
        <Button text={"Prizes"} onClick={() => handleOpenDialog(true)} />
      </div>
      <div className={"flex gap-1 justify-center"}>
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
      {/* <div className={"flex gap-5 mt-4"}>
        <p className={"text-[12px]"}>Prize Name</p>
        <p className={"text-[12px]"}>Total Quantity</p>
        <p className={"text-[12px]"}>Upload</p>
      </div> */}
      {
        prizes.map((item, index) => {
          return (
            <div key={index} className={"flex gap-4 my-2"}>
              <Input size={"sm"} onChange={() => { }} value={''}
                name={`prizes[${index}].prize_name`} />
              <Input size={"sm"} type={"number"} onChange={() => { }} value={0}
                name={`prizes[${index}].total_quantity`} />
              <UploadImageInput image={''} handleChange={(e) => {
                const file = e.target.files?.[0];
                const reader = new FileReader();
                reader.onload = () => {
                  // form3.setFieldValue(`prizes[${index}].image`, reader.result?.toString() || null);
                }
                reader.readAsDataURL(file || new Blob());
              }} name={`prizes[${index}].image`} />
              <div className={"cursor-pointer"} onClick={() => {

              }}>
                <Image width={18} height={18} className="w-[18px] h-[18px] mt-[5px]" src="/images/remove_icon.svg" alt="remove" />
              </div>
            </div>
          )
        })
      }
      <div className={"flex mt-auto justify-center mb-3"}>
        <p className={"opacity-50 text-[14px] cursor-pointer w-fit"} onClick={() => {

        }}>+ Add New Prize</p>
      </div>
    </div>
  );
};

export default OffChainForm;