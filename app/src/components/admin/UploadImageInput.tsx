import React from "react";

interface UploadImageInputProps {
  name: string;
  handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  image?: string;
}

const UploadImageInput: React.FC<UploadImageInputProps> = ({name, handleChange, image}) => {
  const bgImageStyle = {
    backgroundImage: `url(${image})`
  }

  return (
    <div className={"rounded-[8px] relative w-[35px] h-[35px] bg-cover bg-center bg-no-repeat" + (!image && " border border-dashed border-white")}
         style={bgImageStyle}>
      <input id={name} hidden name={name} type={"file"} onChange={handleChange} />
      <label className={"absolute top-0 left-0 cursor-pointer h-full w-full"} htmlFor={name}></label>
       {
         !image && (
           <div className={"flex flex-col place-items-center justify-center h-full"}>
             <p className={"text-[8px]"}>+</p>
             <p className={"text-[9px]"}>Image</p>
           </div>
         )
       }
     </div>
  );
};

export default UploadImageInput;