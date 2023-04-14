/* eslint-disable @next/next/no-img-element */
import { AUTHORIZE_URL } from '@/config';
import { OffChainPrize } from '@/types';
import { useWallet } from '@solana/wallet-adapter-react';
import React, { useRef } from "react";
import { Button } from "../lootboxes/Button";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import axios from 'axios';

interface NftCardProps {
  name: string;
  box?: string;
  image: string;
  claiming?: boolean;
  handler?: () => void;
  prize?: OffChainPrize;
  claimed?: boolean;
  discordAccess?: string;
}

const NftCard: React.FC<NftCardProps> = ({ name, box, image, claiming, handler, prize, claimed, discordAccess }) => {
  const discordRef = useRef<any>();
  const { publicKey } = useWallet();
  const handleClaim = async () => {
    try {
      await axios.post("/api/claim", {
        discord_access: discordAccess,
        user: publicKey?.toString(),
        lootboxName: prize?.lootboxName,
        prizeIndex: prize?.prizeIndex,
        itemIndex: prize?.itemIndex,
      });
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div
      className={"flex flex-col place-items-center h-fit backdrop-blur-[25px] p-2 bg-gradient-box-fill border-[1px] border-[rgba(255,255,255,0.10)] rounded-xl" + (claiming ? " w-[240px]" : " w-[180px]")}>
      <LazyLoadImage
        src={image}
        height={160}
        className='w-full h-auto rounded-xl aspect-square object-cover'
        effect='blur'
      />
      {
        claiming ? (
          <div className={"flex flex-col my-4 place-items-center"}>
            <p className={"font-akira font-[800] text-[24px] mb-2.5"}>{name}</p>
            <a target={"_blank"} href={`${AUTHORIZE_URL}`} ref={discordRef} className='hidden'></a>
            <Button handler={() => {
              if (!discordAccess) {
                discordRef.current.click();
              } else {
                handleClaim();
              }
            }} text={"CONNECT DISCORD"} />
            <p className={"text-[12px] opacity-50 text-center"}>Please connect your Discord & open a ticket in our server to claim.</p>
          </div>
        ) : (
          <>
            <div className={"flex flex-col place-items-center mt-2"}>
              <p className={"text-[14px]"}>{name}</p>
              <p className={"opacity-50 text-[12px]"}>{box}</p>
            </div>
            {!claimed ?
              <div className={"w-full"}>
                <Button handler={handler} text={"CLAIM"} />
              </div> :
              <div className='opacity-0'>
                <Button text={"CLAIM"} />
              </div>
            }
          </>
        )
      }
    </div>
  );
};

export default NftCard;