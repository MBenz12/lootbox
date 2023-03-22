import Button from "../../../components/admin/Button";
import Input from "../../../components/admin/Input";
import Dropdown from "../../../components/admin/Dropdown";
import Image from "next/image";
import { SplPrize, TOKEN } from '@/types';


const SPLForm = ({
  tokens,
  splPrizes,
  currentSplRarity,
  tokenAmounts,
  setTokenAmounts,
  setSplPrizes,
  setCurrentSplRarity,
  handleFundSpl,
  handleDrainSpl,
  handleRemoveSplPrize,
}: {
  tokens: Array<TOKEN>,
  splPrizes: Array<Array<SplPrize>>,
  currentSplRarity: number,
  tokenAmounts: Array<number>,
  setTokenAmounts: (amounts: Array<number>) => void,
  setSplPrizes: (prizes: Array<Array<SplPrize>>) => void,
  setCurrentSplRarity: (rarity: number) => void,
  handleFundSpl: (token: TOKEN, index: number) => void,
  handleDrainSpl: (token: TOKEN, index: number) => void,
  handleRemoveSplPrize: (rarity: number, prizeIndex: number) => void,
}) => {
  return (
    <div className={"grid grid-cols-2 border-2 rounded-2xl border-[rgba(255,255,255,.5)] p-1"}>
      <div className={"flex flex-col border-r-2 border-[rgba(255,255,255,.5)] px-2.5 items-center"}>
        <p className={"text-center text-[30px] font-bold mb-1"}>SPL Prize</p>
        <div className={"flex gap-1"}>
          {
            ['Common', 'Uncommon', 'Rare', 'Legend'].map((category, index) => {
              return (
                <Button
                  key={category + index}
                  size={"sm"}
                  text={category}
                  type={currentSplRarity === index ? "outline" : "ghost"}
                  onClick={() => setCurrentSplRarity(index)}
                />
              )
            }).reverse()
          }
        </div>
        <div className={"mt-4"}>
          {
            splPrizes[currentSplRarity].map((splItem: SplPrize, index: number) => {
              return (
                <div key={index} className={"flex gap-2 my-2 items-center"}>
                  <Input
                    size={"sm"}
                    type={"number"}
                    onChange={(e) => {
                      if (splPrizes[currentSplRarity][index].lootbox) {
                        return;
                      }
                      const newSplPrizes = splPrizes.map(prizes => prizes.map(prize => ({ ...prize })));
                      newSplPrizes[currentSplRarity][index].amount = parseFloat(e.target.value) || 0.0;
                      setSplPrizes(newSplPrizes);
                    }}
                    value={splItem.amount}
                    name={`prizes[${index}].amount`}
                  />
                  <Dropdown
                    onChange={(e) => {
                      const newSplPrizes = splPrizes.map(prizes => prizes.map(prize => ({ ...prize })));
                      newSplPrizes[currentSplRarity][index].index = tokens.map(token => token.symbol).indexOf(e.target.value);
                      setSplPrizes(newSplPrizes);
                    }}
                    value={tokens[splItem.index].symbol}
                    name={`prizes[${index}].wallet`}
                    options={tokens.map(token => token.symbol)}
                  />
                  <div className={"cursor-pointer"} onClick={() => {
                    let prize = splPrizes[currentSplRarity][index];
                    if (prize.lootbox) {
                      handleRemoveSplPrize(currentSplRarity, index);
                    } else {
                      const newSplPrizes = splPrizes.map(prizes => prizes.map(prize => ({ ...prize })));
                      newSplPrizes[currentSplRarity].splice(index, 1);
                      setSplPrizes(newSplPrizes);
                    }
                  }}>
                    <Image width={17} height={17} className="w-[17px] h-[17px] mt-0.5" src="/images/remove_icon.svg" alt="remove" />
                  </div>
                </div>
              )
            })
          }
        </div>
        <div className={"flex mt-auto justify-center"}>
          <p className={"opacity-50 text-[14px] cursor-pointer w-fit mb-5"} onClick={() => {
            const newSplPrizes = splPrizes.map(prizes => prizes.map(prize => ({ ...prize })));

            newSplPrizes[currentSplRarity].push({ index: 0, amount: 0, lootbox: false });
            setSplPrizes(newSplPrizes);
          }}>+ Add SPL Prize</p>
        </div>
      </div>
      <div className={"px-2"}>
        <p className={"text-center text-[30px] font-bold"}>SPL Vault</p>
        <div className={"flex flex-col gap-2 items-center"}>
          {
            tokens.map((token, index) => (
              <div key={token.mint.toString()} className={"flex flex-col"}>
                <div className={"flex"}>
                  <p className='w-10'>{token.symbol}</p>
                  <p>{token.balance}</p>
                </div>
                <div className='flex gap-2'>
                  <div className={"flex gap-2 place-items-center"}>
                    <Input
                      size={"sm"}
                      type={"number"}
                      onChange={(e) => {
                        const amounts = [...tokenAmounts];
                        amounts[index] = parseFloat(e.target.value) || 0;
                        setTokenAmounts(amounts);
                      }}
                      value={tokenAmounts[index]}
                      name={token.symbol}
                    />
                  </div>
                  <div className={"flex gap-1"}>
                    <Button onClick={() => handleFundSpl(token, index)} size={"sm"} text={"Fund"} />
                    <Button onClick={() => handleDrainSpl(token, index)} size={"sm"} text={"Drain"} />
                  </div>
                </div>
              </div>
            )
            )
          }
        </div>        
      </div>
    </div>
  );
};

export default SPLForm;