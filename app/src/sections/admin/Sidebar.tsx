import React from "react";

interface SidebarProps {
  boxes: any[];
  currentBox: any;
  setCurrentBox: (box: any) => void;
}

const Sidebar: React.FC<SidebarProps> = ({boxes, currentBox, setCurrentBox}) => {

  return (
    <div className={"h-full gap-2 flex flex-col min-w-[150px]"}>
      {
        boxes.map((box, index) => (
          <div key={index} onClick={() => setCurrentBox(boxes[index])} className={"cursor-pointer w-fit " + (currentBox.name === box.name ? "opacity-100" : "opacity-50")}>{box.name} BOX</div>
        ))
      }
      <div onClick={() => alert("Create new box handler")} className={"mt-16 cursor-pointer opacity-50 w-fit"}>+ NEW BOX</div>
    </div>
  );
};

export default Sidebar;