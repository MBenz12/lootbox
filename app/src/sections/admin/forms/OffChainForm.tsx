import React from "react";
import Button from "../../../components/admin/Button";
import {useFormik} from "formik";
import Input from "../../../components/admin/Input";
import UploadImageInput from "../../../components/admin/UploadImageInput";
import Image from "next/image";

interface OffChainFormProps {
  rarities: string[];
}

type InitialValues = {
  rarity: string,
  prizes: {
    prize_name: string,
    total_quantity: number,
    image: string
  }[]
}
const OffChainForm: React.FC<OffChainFormProps> = ({rarities}) => {
  const initialValues: InitialValues = {
    rarity: rarities[0],
    prizes: [
      {
        prize_name: '',
        total_quantity: 0,
        image: ""
      }
    ]
  }
  const form3 = useFormik({
    initialValues,
    onSubmit: values => {
      alert(JSON.stringify(values, null, 2));
    }
  });

  React.useEffect(() => {
    console.log(form3.values)
  }, [form3.values]);

  return (
    <div className={"flex flex-col border border-2 rounded-2xl border-[rgba(255,255,255,.5)] p-2"}>
      <p className={"text-center mb-1 text-[30px] font-bold"}>Off-Chain Prize</p>
      <div className={"flex gap-1 justify-center"}>
        {
          rarities.map((item, index) => {
            return (
              <Button key={item + index} size={"sm"} text={item}
                      type={form3.values.rarity === item ? "outline" : "ghost"}
                      onClick={() => {
                             form3.setValues({...form3.values, rarity: rarities[index]})
                           }}/>
            )
          })
        }
      </div>
      <div className={"flex gap-5 mt-4"}>
        <p className={"text-[12px]"}>Prize Name</p>
        <p className={"text-[12px]"}>Total Quantity</p>
        <p className={"text-[12px]"}>Upload</p>
      </div>
      {
        form3.values.prizes.map((item, index) => {
          return (
            <div key={index} className={"flex gap-4 my-2"}>
              <Input size={"sm"} onChange={form3.handleChange} value={item.prize_name}
                     name={`prizes[${index}].prize_name`}/>
              <Input size={"sm"} type={"number"} onChange={form3.handleChange} value={item.total_quantity}
                     name={`prizes[${index}].total_quantity`}/>
              <UploadImageInput image={form3.values.prizes[index].image} handleChange={(e) => {
                const file = e.target.files?.[0];
                const reader = new FileReader();
                reader.onload = () => {
                  form3.setFieldValue(`prizes[${index}].image`, reader.result?.toString() || null);
                }
                reader.readAsDataURL(file || new Blob());
              }} name={`prizes[${index}].image`}/>
              <div className={"cursor-pointer"} onClick={() => {
                const prizes = [...form3.values.prizes];
                prizes.splice(index, 1);
                form3.setValues({...form3.values, prizes});
              }}>
                <Image width={18} height={18} className="w-[18px] h-[18px] mt-[5px]" src="/images/remove_icon.svg" alt="remove"/>
              </div>
            </div>
          )
        })
      }
      <div className={"flex mt-auto justify-center"}>
        <p className={"opacity-50 text-[14px] cursor-pointer w-fit"} onClick={() => {
          form3.setFieldValue(`prizes[${form3.values.prizes.length}]`, initialValues.prizes[0]);
        }}>+ Add New Prize</p>
      </div>
    </div>
  );
};

export default OffChainForm;