import React from "react";

interface SidebarProps {
  boxes: string[];
  currentBox: string;
  setCurrentBox: (name: string) => void;
  createNewBox: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ boxes, currentBox, setCurrentBox, createNewBox }) => {

  return (
    <div className={"h-full gap-2 flex flex-col min-w-[150px]"}>
      {
        boxes.map((name, index) => (
          <div key={index} onClick={() => setCurrentBox(name)} className={"cursor-pointer w-fit " + (name === currentBox ? "opacity-100" : "opacity-50")}>{name}</div>
        ))
      }
      <div onClick={() => createNewBox()} className={"mt-16 cursor-pointer opacity-50 w-fit"}>+ NEW BOX</div>
    </div>
  );
};

export default Sidebar;