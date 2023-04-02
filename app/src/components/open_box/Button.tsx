import React from "react";

interface ButtonProps {
  text: string;
  handler?: () => void;
}

export const Button: React.FC<ButtonProps> = ({text, handler}) => {
  return (
    <div className="relative flex cursor-pointer place-items-center justify-center border-none text-center uppercase text-white transition-all duration-300 bg-gradient-button m-2.5 px-[25px] py-[4px] bg-[200%_auto] rounded-[5px] gap-[8px] hover:bg-right-center" onClick={handler}>
      <p className={`text-[18px] font-akira font-[800]`} style={{transform: "scaleY(85%)"}}>{text}</p>
    </div>
  );
}