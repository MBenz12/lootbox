import { WinnablePrize } from "@/types";
import { PrizeItem } from "@/components/open_box/PrizeItem";
import { Lootbox } from '@/lootbox-program-libs/types';
import { isToken } from '@/utils';

export const Prizes = ({ prizes, lootbox }: { prizes: Array<WinnablePrize>, lootbox: Lootbox | undefined }) => {
  return (
    <div>
      <h1 className={"font-akira font-[800] uppercase text-xl my-5"}>Winnable Prizes</h1>
      <div className={"grid grid-cols-[repeat(auto-fill,_minmax(280px,_1fr))] gap-x-4 gap-y-4"}>
        {lootbox &&
          prizes.map((prize, index) => (
            <PrizeItem 
            key={index} 
            rarity={prize.rarity} 
            icon={prize.image} 
            title={isToken(prize.name) ? `${prize.value.toLocaleString('en-us', { maximumFractionDigits: 3 })} ${prize.name}` : prize.name} 
            value={(isToken(prize.name) && prize.name !== 'SOL') ? undefined : prize.value} 
            dropRate={lootbox.rarities[prize.rarity].dropPercent / 100} 
            />
          ))
        }
      </div>
    </div>
  );
};