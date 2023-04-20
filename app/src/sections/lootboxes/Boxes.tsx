import BoxItem from "../../components/lootboxes/BoxItem";
import { Lootbox } from '@/lootbox-program-libs/types';
import { getTokenIndex } from '@/utils';
import { useRouter } from 'next/router'

export const Boxes = ({ lootboxes, }: { lootboxes: Array<Lootbox> }) => {
  const router = useRouter();

  const boxes: { [key: string]: { name: string, nameColor: string, description: string, price: number, } } = {
    "Zen": {
      name: "ZEN",
      nameColor: "#E93E67",
      description: "Use ZEN for a chance to win NFTs, SOL, merch and more.",
      price: 500
    },
    "Free": {
      name: "Free",
      nameColor: "#2A6ED4",
      description: "Try a free spin by having staked Ukiyans in your wallet.",
      price: 0
    }
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,_minmax(290px,_1fr))] place-items-center gap-5 gap-y-20 my-20">
      {
        lootboxes.map((lootbox: Lootbox, index: number) => {
          const box = boxes["Free"];
          return (
            <BoxItem key={index} shadowColor={box.nameColor} handleClick={() => router.push(`/${lootbox.name}`)} name={box.name} nameColor={box.nameColor} description={box.description} price={lootbox.ticketPrice.toNumber()} tokenIndex={getTokenIndex(lootbox.ticketMint)} />
          )
        })
      }
    </div>
  );
};