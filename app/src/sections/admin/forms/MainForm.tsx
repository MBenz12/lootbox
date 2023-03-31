import React from "react";
import Input from "../../../components/admin/Input";
import Dropdown from "../../../components/admin/Dropdown";
import Button from "../../../components/admin/Button";
import { TOKEN } from '@/types';
import { Lootbox } from '@/lootbox-program-libs/types';

const MainForm = ({
  name,
  lootbox,
  fee,
  feeWallet,
  ticketPrice,
  ticketToken,
  tokens,
  setName,
  setFee,
  setFeeWallet,
  setTicketPrice,
  setTicketToken,
  handleClickCreate,
  handleClickClose,
}: {
  name: string,
  lootbox: Lootbox | undefined,
  fee: number,
  feeWallet: string,
  ticketPrice: number,
  ticketToken: TOKEN,
  tokens: Array<TOKEN>
  setName: (name: string) => void,
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
      <div className={"flex gap-10"}>
        <div className={"flex flex-col gap-5"}>
          {<Input size={"sm"} fullWidth onChange={(e) => setName(e.target.value)} name={"box_name"} value={name} label={"Box Name"} />}
          <Input size={"sm"} step={0.01} type={"number"} onChange={(e) => setFee(parseFloat(e.target.value))} name={"txn_fee"} value={fee} label={"Txn Fee"}
            desc={"SOL"} />
        </div>
        <div className={"flex flex-col gap-5"}>
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
          <Input size={"sm"} fullWidth onChange={(e) => setFeeWallet(e.target.value)} value={feeWallet} name={"fee_wallet"}
            label={"Fee Wallet"} />
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