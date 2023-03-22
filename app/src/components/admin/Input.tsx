import React from "react";

interface InputProps {
  label?: string;
  desc?: string;
  name: string;
  value: string | number;
  step?: number;
  type?: "text" | "number";
  size?: "sm" | "md" | "lg";
  placeholder?: string;
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fullWidth?: boolean;
}

const Input: React.FC<InputProps> = ({
                                       label,
                                       size = "md",
                                       type = "text",
                                       desc,
                                       placeholder,
                                       required,
                                       value,
                                       step,
                                       onChange,
                                       fullWidth = false,
                                       name
                                     }) => {
  let inputClassName = "bg-gray-50 border focus:outline-none border-gray-300 text-gray-900 rounded-[8px] min-w-[80px]";
  let labelClassName = "font-medium text-white";

  if (fullWidth)
    inputClassName += " w-full";
  else
    inputClassName += " w-[80px]";
  if (size === "sm") {
    inputClassName += " text-sm px-2 py-1";
    labelClassName += " text-[12px]";
  }
  if (size === "md") {
    inputClassName += " text-md px-3 py-1.5";
    labelClassName += " text-md";
  }
  if (size === "lg") {
    inputClassName += " text-lg px-4 py-2";
    labelClassName += " text-lg";
  }

  return (
    <div className={"flex flex-col"}>
      <label className={labelClassName}>
        {label}
      </label>
      <div className={"flex place-items-center gap-2"}>
        <input
          type={type}
          className={inputClassName}
          placeholder={placeholder}
          required={required}
          name={name}
          value={value}
          step={step}
          onChange={onChange}
        />
        {
          desc && (
            <p className="text-white text-md">{desc}</p>
          )
        }
      </div>
    </div>
  );
};

export default Input;