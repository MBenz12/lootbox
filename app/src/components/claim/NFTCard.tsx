/* eslint-disable @next/next/no-img-element */
import { AUTHORIZE_URL } from '@/config';
import { OffChainPrize } from '@/types';
import { useWallet } from '@solana/wallet-adapter-react';
import React, { useRef } from "react";
import { Button } from "../lootboxes/Button";

interface NftCardProps {
  name: string;
  box?: string;
  image: string;
  claiming?: boolean;
  handler?: () => void;
  prize?: OffChainPrize;
  claimed?: boolean;
}

const NftCard: React.FC<NftCardProps> = ({ name, box, image, claiming, handler, prize, claimed }) => {
  const discordRef = useRef<any>();
  const { publicKey } = useWallet();
  return (
    <div
      className={"flex flex-col place-items-center h-fit backdrop-blur-[25px] p-2 bg-gradient-box-fill border-[1px] border-[rgba(255,255,255,0.10)] rounded-xl" + (claiming ? " w-[240px]" : " w-[180px]")}>
      <img className={"w-full h-auto rounded-xl aspect-square object-cover"} src={image} alt="" />
      {
        claiming ? (
          <div className={"flex flex-col my-4 place-items-center"}>
            <p className={"font-akira font-[800] text-[24px] mb-2.5"}>{name}</p>
            <a target={"_blank"} href={`${AUTHORIZE_URL}&state=${JSON.stringify({
              user: publicKey?.toString(),
              lootboxName: prize?.lootboxName,
              prizeIndex: prize?.prizeIndex,
              itemIndex: prize?.itemIndex,
            })}`} ref={discordRef} className='hidden'></a>
            <Button handler={() => {
              discordRef.current.click();
            }} text={"CONNECT DISCORD"} />
            <p className={"text-[12px] opacity-50 text-center"}>Please connect your Discord & open a ticket in our server to claim.</p>
          </div>
        ) : (
          <>
            <div className={"flex flex-col place-items-center mt-2"}>
              <p className={"text-[14px]"}>{name}</p>
              <p className={"opacity-50 text-[12px]"}>{box}</p>
            </div>
            {!claimed && <div className={"w-full"}>
              <Button handler={handler} text={"CLAIM"} />
            </div>}
          </>
        )
      }
    </div>
  );
};

export default NftCard;