import React from "react";

interface NftsSectionProps {
  children: React.ReactNode;
  heading: React.ReactNode;
}

const NftsSection: React.FC<NftsSectionProps> = ({children, heading}) => {
  return (
    <div className='border border-white rounded-xl w-full h-[400px] overflow-y-auto overflow-x-hidden py-5 px-10 flex flex-col gap-5'>
      {heading}
      <div className={"grid grid-cols-[repeat(auto-fill,_minmax(150px,_1fr))] gap-2 gap-y-4  w-full"}>
        {children}
      </div>
    </div>
  );
};

export default NftsSection;