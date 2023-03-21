import React from "react";
import {Button} from "@/components/lootboxes/Button";

const Heading: React.FC = () => {
  return (
    <div className={"relative w-fit py-6 flex gap-4 place-items-center claim-heading"}>
      <h1 className={"font-akira font-[800] text-[38px]"}>CLAIM PRIZES</h1>
      <Button text={"Claim All Prizes"} handler={() => alert("Claim all prizes handler")} />
    </div>
  );
};

export default Heading;