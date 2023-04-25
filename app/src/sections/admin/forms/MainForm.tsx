import React from "react";
import Input from "../../../components/admin/Input";
import Dropdown from "../../../components/admin/Dropdown";
import Button from "../../../components/admin/Button";
import { TOKEN } from '@/types';
import { Lootbox } from '@/lootbox-program-libs/types';
import UploadImageInput from '@/components/admin/UploadImageInput';

const MainForm = ({
  name,
  description,
  image,
  imageFile,
  lootbox,
  fee,
  feeWallet,
  ticketPrice,
  ticketToken,
  tokens,
  setName,
  setDescription,
  setImage,
  setImageFile,
  setFee,
  setFeeWallet,
  setTicketPrice,
  setTicketToken,
  handleClickCreate,
  handleClickClose,
}: {
  name: string,
  description: string,
  image: string,
  imageFile: File | undefined,
  lootbox: Lootbox | undefined,
  fee: number,
  feeWallet: string,
  ticketPrice: number,
  ticketToken: TOKEN,
  tokens: Array<TOKEN>
  setName: (name: string) => void,
  setDescription: (desc: string) => void,
  setImage: (img: string) => void,
  setImageFile: (file: File) => void,
  setFee: (fee: number) => void,
  setFeeWallet: (feeWallet: string) => void,
  setTicketPrice: (price: number) => void,
  setTicketToken: (token: TOKEN) => void,
  handleClickCreate: () => void,
  handleClickClose: () => void,
}) => {
  return (
    <div className={"flex flex-col gap-5"}>
      <p className={"text-[46px] font-bold"}>{name}</p>
      <div className={"flex flex-col gap-2"}>
        <div className='flex gap-2'>
          <Input size={"sm"} fullWidth onChange={(e) => setName(e.target.value)} name={"box_name"} value={name} label={"Box Name"} />
          <div className={"flex gap-2"}>
            <Input size={"sm"} step={0.1} type={"number"} onChange={(e) => setTicketPrice(parseFloat(e.target.value))} value={ticketPrice} name={"box_cost"} label={"Box Cost"} />
            <div className={"mt-[18px]"}>
              <Dropdown
                onChange={(e) => {
                  const index = tokens.map(token => token.symbol).indexOf(e.target.value);
                  setTicketToken(tokens[index]);
                }}
                value={ticketToken.symbol}
                name={"token"}
                options={tokens.map(token => token.symbol)}
              />
            </div>
          </div>
        </div>
        <Input size={"sm"} step={0.01} type={"number"} onChange={(e) => setFee(parseFloat(e.target.value))} name={"txn_fee"} value={fee} label={"Txn Fee"} desc={"SOL"} />
        <Input size={"sm"} fullWidth onChange={(e) => setFeeWallet(e.target.value)} value={feeWallet} name={"fee_wallet"} label={"Fee Wallet"} />
        <div>
          <p className='text-[12px]'>Box Description</p>
          <textarea rows={4} onChange={(e) => setDescription(e.target.value)} value={description} className='text-black p-2 text-[14px] w-full'></textarea>
        </div>
        <div>
          <p className='text-[12px]'>Box Image</p>
          <UploadImageInput
            image={image}
            handleChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setImageFile(file);
              const reader = new FileReader();
              reader.onload = () => {
                setImage(reader.result?.toString() || '');
              }
              reader.readAsDataURL(file || new Blob());
            }}
            name={`image`}
          />
        </div>
      </div>
      <div className='flex gap-2'>
        <Button size={"md"} onClick={handleClickCreate} text={!lootbox ? "Create" : "Update"} />
        {lootbox && <Button size={"md"} onClick={handleClickClose} text="Close" />}
      </div>
    </div>
  );
};

export default MainForm;