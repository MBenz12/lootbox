import React from "react";

interface CardsSectionProps {
  sectionName: string;
  children?: React.ReactNode;
}

const CardsSection: React.FC<CardsSectionProps> = ({sectionName, children}) => {
  return (
    <div className={"my-10"}>
      <h1 className={"font-space-mono font-bold text-[18px] my-2"}>{sectionName}</h1>
      <div className={"grid grid-cols-[repeat(auto-fill,_minmax(180px,_1fr))] gap-4"}>
        {children}
      </div>
    </div>
  );
};

export default CardsSection;