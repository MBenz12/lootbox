import React from "react";

interface NftsSectionProps {
  children: React.ReactNode;
}

const NftsSection: React.FC<NftsSectionProps> = ({children}) => {
  return (
    <div className={"grid grid-cols-[repeat(auto-fill,_minmax(150px,_1fr))] gap-2 gap-y-4 border border-white rounded-xl p-10 w-full h-[400px] overflow-y-auto overflow-x-hidden"}>
      {children}
    </div>
  );
};

export default NftsSection;