import React from "react";

interface ButtonProps {
  text: string;
  handler?: () => void;
}

export const Button: React.FC<ButtonProps> = ({text, handler}) => {
  return (
    <div className={`relative flex place-items-center justify-center border-none text-center uppercase text-white transition-all duration-300 bg-gradient-button m-2.5 px-[35px] py-[6px] bg-[200%_auto] rounded-[5px] gap-[8px] hover:bg-right-center ${handler ? "cursor-pointer" : "cursor-not-allowed"}`} onClick={handler}>
      <p className={`text-[18px] font-akira font-[800] tracking-wider`}>{text}</p>
    </div>
  );
}