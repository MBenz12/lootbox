import { WinnablePrize } from "@/types";
import { PrizeItem } from "@/components/open_box/PrizeItem";

export const Prizes = ({ prizes }: { prizes: Array<WinnablePrize> }) => {
  return (
    <div>
      <h1 className={"font-akira font-[800] uppercase text-xl my-5"} style={{transform: "scaleY(75%)"}}>Winnable Prizes</h1>
      <div className={"grid grid-cols-[repeat(auto-fill,_minmax(280px,_1fr))] gap-x-6 gap-y-4 w-full"}>
        {
          prizes.map((prize, index) => (
            <PrizeItem key={index} rarity={prize.rarity} icon={prize.image} title={prize.name} value={prize.value} dropRate={1} />
          ))
        }
      </div>
    </div>
  );
};