import React from "react";
import Button from "../../../components/admin/Button";
import Input from "../../../components/admin/Input";
import Dropdown from "../../../components/admin/Dropdown";
import {useFormik} from "formik";
import Image from "next/image";

interface SPLFormProps {
  options: string[]
  rarities: string[]
}

type InitialValues = {
  rarity: string,
  prizes: {
    amount: number,
    wallet: string,
  }[],
  spl_vault: {
    [key: string]: number
  }
}

const SPLForm: React.FC<SPLFormProps> = ({rarities, options}) => {
  const initialValues: InitialValues = {
    rarity: rarities[0],
    prizes: [
      {
        amount: 0,
        wallet: '',
      }
    ],
    spl_vault: {
      sol: 0,
      zen: 0,
      dust: 0
    }
  }

  const splForm = useFormik({
    initialValues,
    onSubmit: values => {
      alert(JSON.stringify(values, null, 2));
    }
  });

  const splVault = useFormik({
    initialValues: initialValues.spl_vault,
    onSubmit: values => {
      alert(JSON.stringify(values, null, 2));
    }
  })

  const handleUpdateSplValues = (wallet: string, operation: "inc" | "dec") => {
    const value = splVault.values[wallet];
    if (value <= 0) return;
    if (operation === "inc") {
      splForm.setFieldValue(`spl_vault.${wallet}`, splForm.values.spl_vault[wallet] + value);
    }
    if (operation === "dec") {
      splForm.setFieldValue(`spl_vault.${wallet}`, splForm.values.spl_vault[wallet] - value);
    }
  }

  React.useEffect(() => {
    console.log(splForm.values)
  }, [splForm.values]);

  return (
    <div className={"grid grid-cols-2 border border-2 rounded-2xl border-[rgba(255,255,255,.5)] p-1"}>
      <div className={"flex flex-col border-r-2 border-[rgba(255,255,255,.5)] px-2.5"}>
        <p className={"text-center text-[30px] font-bold mb-1"}>SPL Prize</p>
        <div className={"flex gap-1"}>
          {
            rarities.map((item, index) => {
              return (
                <Button key={item + index} size={"sm"} text={item}
                        type={splForm.values.rarity === item ? "outline" : "ghost"}
                        onClick={() => {
                               splForm.setValues({...splForm.values, rarity: rarities[index]})
                             }}/>
              )
            })
          }
        </div>
        <div className={"mt-4"}>
          <p className={"text-[12px]"}>Amount</p>
        </div>
        {
          splForm.values.prizes.map((item, index) => {
            return (
              <div key={index} className={"flex gap-2 my-2"}>
                <Input size={"sm"} type={"number"} onChange={splForm.handleChange} value={item.amount} name={`prizes[${index}].amount`}/>
                <Dropdown onChange={splForm.handleChange} value={item.wallet} name={`prizes[${index}].wallet`}
                          options={options}/>
                <div className={"cursor-pointer"} onClick={() => {
                  const prizes = [...splForm.values.prizes];
                  prizes.splice(index, 1);
                  splForm.setValues({...splForm.values, prizes});
                }}>
                  <Image width={17} height={17} className="w-[17px] h-[17px] mt-0.5" src="/images/remove_icon.svg" alt="remove"/>
                </div>
              </div>
            )
          })
        }
        <div className={"flex mt-auto justify-center"}>
          <p className={"opacity-50 text-[14px] cursor-pointer w-fit"} onClick={() => {
            splForm.setFieldValue(`prizes[${splForm.values.prizes.length}]`, initialValues.prizes[0]);
          }}>+ Add SPL Prize</p>
        </div>
      </div>
      <div className={"px-5"}>
        <p className={"text-center text-[30px] font-bold"}>SPL Vault</p>
        <div className={"grid gap-5"}>

          {
            options.map((item, index) => {
              const wallet = item.toLowerCase();
              return (
                <div key={item+index} className={"flex place-items-end gap-2"}>
                  <div>
                    <div className={"flex justify-between"}>
                      <p>{item}</p>
                      <p>{splForm.values.spl_vault[wallet]}</p>
                    </div>
                    <div className={"flex gap-2 place-items-center"}>
                      <p className={"mt-[6px] text-[14px]"}>Fund</p>
                      <Input size={"sm"} type={"number"} onChange={splVault.handleChange} value={splVault.values[wallet]} name={wallet}/>
                    </div>
                  </div>
                  <div className={"flex gap-1"}>
                    <Button onClick={() => handleUpdateSplValues(wallet, "inc")} size={"sm"} text={"Fund"}/>
                    <Button onClick={() => handleUpdateSplValues(wallet, "dec")} size={"sm"} text={"Drain"}/>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  );
};

export default SPLForm;