import React from "react";

interface AdminButtonProps {
  text?: string;
  type?: "outline" | "filled" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  onClick?: () => void;
}

const Button: React.FC<AdminButtonProps> = ({text, size = "md", onClick, type = "filled", disabled}) => {
  let className = "rounded-[8px]";
  if (type === "outline")
    className += " border border-white text-white";
  if (type === "filled")
    className += " bg-white text-black";
  if (type === "ghost")
    className += " border border-[1px] border-white text-white opacity-60";
  if (disabled)
    className += " opacity-50 cursor-not-allowed";
  if (size === "sm")
    className += " text-[12px] px-2 py-1";
  if (size === "md")
    className += " text-md px-5 py-1.5";
  if (size === "lg")
    className += " text-lg px-4 py-2";

  return (
    <button
      className={className}
      onClick={onClick}
      disabled={disabled}>
      {text}
    </button>
  );
};

export default Button;