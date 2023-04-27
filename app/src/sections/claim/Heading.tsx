import {Button} from "@/components/lootboxes/Button";

const Heading = ({ handleClaimAll }: { handleClaimAll: () => void }) => {
  return (
    <div className={"relative w-fit py-6 flex gap-4 place-items-center claim-heading flex-wrap"}>
      <h1 className={"font-akira font-[800] sm:text-[38px] text-[24px]"}>CLAIM PRIZES</h1>
      <Button text={"Claim All"} handler={handleClaimAll} />
    </div>
  );
};

export default Heading;