import React from 'react';
import BoxItem from "../../components/lootboxes/BoxItem";
import { ModalContext } from "@/contexts/modal-context";
import { Lootbox } from '@/lootbox-program-libs/types';
import useProgram from '@/hooks/useProgram';
import { useWallet } from '@solana/wallet-adapter-react';
import { play } from '@/lootbox-program-libs/methods';
import { toast } from 'react-toastify';

export const Boxes = ({ lootboxes, setReload, }: { lootboxes: Array<Lootbox>, setReload: (reload: {}) => void }) => {
  const boxes: { [key: string]: { name: string, nameColor: string, description: string, price: number, } } = {
    "zen-box": {
      name: "ZEN",
      nameColor: "#E93E67",
      description: "Use ZEN for a chance to win NFTs, SOL, merch and more.",
      price: 500
    },
    "lootbox": {
      name: "Free",
      nameColor: "#2A6ED4",
      description: "Try a free spin by having staked Ukiyans in your wallet.",
      price: 0
    }
  }

  const { showModal } = React.useContext(ModalContext)

  const program = useProgram();
  const wallet = useWallet();

  const handlePlay = async (lootbox: Lootbox) => {
    if (!wallet.publicKey || !program) {
      return;
    }

    const txn = await play(
      program,
      lootbox.name,
      wallet,
      lootbox.feeWallet,
      lootbox.ticketMint,
      lootbox.ticketPrice,
    );

    if (txn) {
      toast.success('Created player account successfully');
      setReload({});
    } else {
      toast.error('Failed to create player account');
    }
  }
  return (
    <div className="grid grid-cols-[repeat(auto-fill,_minmax(290px,_1fr))] place-items-center gap-5 gap-y-20 my-20">
      {
        lootboxes.map((lootbox: Lootbox, index: number) => {
          const box = boxes[lootbox.name];
          return (
            <BoxItem key={index} handleClick={() => {
              handlePlay(lootbox);
              // showModal(
              //   <BoxItem name={box.name} nameColor={box.nameColor} description={box.description} price={box.price} opening />
              // )
            }} name={box.name} nameColor={box.nameColor} description={box.description} price={box.price} />
          )
        })
      }
    </div>
  );
};