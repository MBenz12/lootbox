import React from "react";
import {Button} from "../lootboxes/Button";

interface NftCardProps {
  name: string;
  box?: string;
  image: string;
  claiming?: boolean;
  handler?: () => void;
}

const NftCard: React.FC<NftCardProps> = ({name, box, image, claiming, handler}) => {
  return (
    <div
      className={"flex flex-col place-items-center h-fit backdrop-blur-[25px] p-2 bg-gradient-box-fill border-[1px] border-[rgba(255,255,255,0.10)] rounded-xl" + (claiming ? " w-[240px]" : " w-[180px]")}>
      <img className={"w-full h-auto rounded-xl object-cover"} src={image} alt=""/>
      {
        claiming ? (
          <div className={"flex flex-col my-4 place-items-center"}>
            <p className={"font-akira font-[800] text-[24px] mb-2.5"}>{name}</p>
            <p className={"text-[12px] opacity-50 text-center"}>Please open a ticket in our Discord to claim your prize.</p>
          </div>
        ) : (
          <>
            <div className={"flex flex-col place-items-center mt-2"}>
              <p className={"text-[14px]"}>{name}</p>
              <p className={"opacity-50 text-[12px]"}>{box}</p>
            </div>
            <div className={"w-full"}>
              <Button handler={handler} text={"CLAIM"}/>
            </div>
          </>
        )
      }
    </div>
  );
};

export default NftCard;