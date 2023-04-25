import { ReloadContext } from '@/contexts/reload-context';
import BoxItem from "../../components/lootboxes/BoxItem";
import { Lootbox } from '@/lootbox-program-libs/types';
import { getBox, getTokenIndex } from '@/utils';
import { useRouter } from 'next/router'
import { useContext } from 'react';
import useFetchBoxes from '@/hooks/useFetchBoxes';

export const Boxes = ({ lootboxes, }: { lootboxes: Array<Lootbox> }) => {
  const router = useRouter();
  const { reload } = useContext(ReloadContext);
  const { boxes } = useFetchBoxes(reload);
  return (
    <div className="grid grid-cols-[repeat(auto-fill,_minmax(290px,_1fr))] place-items-center gap-5 gap-y-20 my-20">
      {
        lootboxes.map((lootbox: Lootbox, index: number) => {
          const box = getBox(boxes, lootbox.name);
          return (
            <BoxItem
              key={index}
              shadowColor={'#2A6ED4'}
              nameColor={"#2A6ED4"}
              handleClick={() => router.push(`/${lootbox.name}`)}
              name={box?.name || ''}
              description={box?.description || ''}
              price={lootbox.ticketPrice.toNumber()}
              tokenIndex={getTokenIndex(lootbox.ticketMint)}
            />
          )
        })
      }
    </div>
  );
};