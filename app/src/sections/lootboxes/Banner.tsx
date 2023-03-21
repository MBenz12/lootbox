import React from 'react';

export const Banner: React.FC = () => {
  return (
    <div className="relative right-1/2 left-1/2 translate-x-[-50%] min-h-[360px] banner">
      <p className="font-extrabold uppercase text-[68px] font-akira lg:text-[110px]">UKIYO</p>
      <p className="text-[38px] mt-[-20px] ml-[8px] lg:text-[32px] lg:mt-[-30px]"><span className="text-[#FF6C6C]">LOOT</span>BOX</p>
    </div>
  );
};