import React from "react";

interface DropdownProps {
  value: string;
  name: string;
  options: string[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Dropdown: React.FC<DropdownProps> = ({options, onChange, value, name}) => {
  return (
    <div>
      <select
        className="block w-fit bg-white p-1.5 text-sm text-black rounded-[8px]"
        name={name}
        value={value}
        onChange={onChange}
      >
        {
          options.map((option, index) => {
            return (
              <option className={"text-black"} value={option} key={index}>{option}</option>
            )
          })
        }
      </select>

    </div>
  );
};

export default Dropdown;