import React from "react";
import MainForm from "./forms/MainForm";
import SPLForm from "./forms/SPLForm";
import OffChainForm from "./forms/OffChainForm";
import NftsSection from "./NftsSection";
import Input from "../../components/admin/Input";
import Button from "../../components/admin/Button";
import NftCard from "../../components/admin/NftCard";
import SelectNftsDialog from "../../components/admin/SelectNftsDialog";
import {useFormik} from "formik";

interface MainProps {
  box: any;
}

type InitialValues = {
  [key: string]: {
    dropPercentage: number;
    minSOLValue: number;
    minSpins: number;
  }
}

const Main: React.FC<MainProps> = ({box}) => {
  const rarities = ["Legendary", "Rare", "Uncommon", "Common"];
  const options = ["SOL", "ZEN", "DUST"];
  const [showDialog, setShowDialog] = React.useState(false);
  const initialValues: InitialValues = {
    legendary: {
      dropPercentage: 0,
      minSOLValue: 0,
      minSpins: 0,
    },
    rare: {
      dropPercentage: 0,
      minSOLValue: 0,
      minSpins: 0,
    },
    uncommon: {
      dropPercentage: 0,
      minSOLValue: 0,
      minSpins: 0,
    },
    common: {
      dropPercentage: 0,
      minSOLValue: 0,
      minSpins: 0,
    },
  }
  const raritiesForm = useFormik({
    initialValues,
    onSubmit: values => {
      alert(JSON.stringify(values, null, 2));
    },
  });
  const toggleShowDialog = () => {
    setShowDialog(!showDialog);
  }

  React.useEffect(() => {
    console.log(raritiesForm.values)
  }, [raritiesForm.values])

  return (
    <div className={"flex flex-wrap justify-center w-full gap-5"}>
      <SelectNftsDialog show={showDialog} toggleShow={toggleShowDialog}/>

      <MainForm boxName={box.name} options={options}/>

      <SPLForm options={options} rarities={rarities}/>

      <OffChainForm rarities={rarities}/>

      <div className={"w-full flex justify-center my-5"}>
        <Button onClick={() => {
          setShowDialog(true)
        }} text={"Auto Fill NFTs"}/>
      </div>

      {
        rarities.map((rarity: string) => {
          return (
            <div key={rarity} className={"mx-24 w-full mt-10"}>
              <form onSubmit={raritiesForm.handleSubmit} className={"flex place-items-center gap-4 mb-5"}>
                <p className={"text-[32px]"}>{rarity}</p>
                <div className={"flex gap-5"}>
                  <Input size={"sm"} type={"number"} name={`${rarity.toLowerCase()}.dropPercentage`} onChange={raritiesForm.handleChange} label={"Drop %"} value={raritiesForm.values[rarity.toLowerCase()].dropPercentage}/>
                  <Input size={"sm"} type={"number"} name={`${rarity.toLowerCase()}.minSOLValue`} onChange={raritiesForm.handleChange} label={"Min. SOL Value"} value={raritiesForm.values[rarity.toLowerCase()].minSOLValue}/>
                  <Input size={"sm"} type={"number"} name={`${rarity.toLowerCase()}.minSpins`} onChange={raritiesForm.handleChange} label={"Min. Spins"} value={raritiesForm.values[rarity.toLowerCase()].minSpins}/>
                </div>
                <div className={"ml-auto"}>
                  <Button text={"Add NFTs"} onClick={() => alert(`Add ${rarity} nft to ${box.name} box handler`)}/>
                </div>
              </form>
              <NftsSection>
                {
                  box.nfts.map((nft: any, index: number) => {
                    return <NftCard image={nft.image} price={nft.price} key={index}/>
                  })
                }
              </NftsSection>
            </div>
          )
        })
      }

    </div>
  );
};

export default Main;