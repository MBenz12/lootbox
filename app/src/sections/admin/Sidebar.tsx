import { ReloadContext } from '@/contexts/reload-context';
import useFetchBoxes from '@/hooks/useFetchBoxes';
import { getBox } from '@/utils';
import React, { useContext, useMemo } from "react";

interface SidebarProps {
  boxes: string[];
  currentBox: string;
  setCurrentBox: (name: string) => void;
  createNewBox: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ boxes: boxIds, currentBox, setCurrentBox, createNewBox }) => {
  const { reload } = useContext(ReloadContext);
  const { boxes } = useFetchBoxes(reload);
  return (
    <div className={"h-full gap-2 flex flex-col min-w-[150px]"}>
      {
        boxIds.map((id, index) => {
          let box = getBox(boxes, id);
          const name = box ? box.name : 'Free';
          return (
            <div key={index} onClick={() => setCurrentBox(id)} className={"cursor-pointer w-fit " + (id === currentBox ? "opacity-100" : "opacity-50")}>{name}</div>
          )
        })
      }
      <div onClick={() => createNewBox()} className={"mt-16 cursor-pointer opacity-50 w-fit"}>+ NEW BOX</div>
    </div>
  );
};

export default Sidebar;