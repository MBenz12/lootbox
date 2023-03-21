import React from "react";
import Input from "../../../components/admin/Input";
import Dropdown from "../../../components/admin/Dropdown";
import Button from "../../../components/admin/Button";
import {useFormik} from "formik";

interface Form1Props {
  boxName: string,
  options: string[]
}

type InitialValues = {
  box_name: string,
  txn_fee: number,
  box_cost: number,
  fee_wallet: string,
  wallet: string,
}

const MainForm: React.FC<Form1Props> = ({boxName,options}) => {
  // You can add form as a prop and handle form values in the parent component
  const initialValues: InitialValues = {
    box_name: '',
    txn_fee: 0,
    box_cost: 0,
    fee_wallet: '',
    wallet: options[0],
  }
  const mainForm = useFormik({
    initialValues,
    onSubmit: values => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  return (
    <form onSubmit={mainForm.handleSubmit} className={"flex flex-col gap-5"}>
      <p className={"text-[46px] font-bold"}>{boxName} BOX</p>
      <div className={"flex gap-10"}>
        <div className={"flex flex-col gap-5"}>
          <Input size={"sm"} onChange={mainForm.handleChange} name={"box_name"} value={mainForm.values.box_name} label={"Box Name"}/>
          <Input size={"sm"} type={"number"} onChange={mainForm.handleChange} name={"txn_fee"} value={mainForm.values.txn_fee} label={"Txn Fee"}
                 desc={"SOL"}/>
        </div>
        <div className={"flex flex-col gap-5"}>
          <div className={"flex gap-2"}>
            <Input size={"sm"} type={"number"} onChange={mainForm.handleChange} value={mainForm.values.box_cost} name={"box_cost"} label={"Box Cost"}/>
            <div className={"mt-[18px]"}>
              <Dropdown onChange={mainForm.handleChange} value={mainForm.values.wallet} name={"wallet"} options={options}/>
            </div>
          </div>
          <Input size={"sm"} onChange={mainForm.handleChange} value={mainForm.values.fee_wallet} name={"fee_wallet"}
                 label={"Fee Wallet"}/>
        </div>
      </div>
      <div>
        <Button size={"md"} onClick={() => mainForm.handleSubmit} text={"Save"}/>
      </div>
    </form>
  );
};

export default MainForm;