import React from 'react';

export const Banner: React.FC = () => {
  return (
    <div className="relative right-1/2 left-1/2 translate-x-[-50%] aspect-[2.2] lg:aspect-[3.8] banner">
      <p className="font-extrabold uppercase text-[62px] font-akira leading-tight pt-[20px] lg:text-[110px] lg:pt-[40px]">UKIYO</p>
      <p className="text-[22px] font-america-mono mt-[-13px] lg:text-[36px] lg:mt-[-20px]"><span className="text-[#FF6C6C] font-america-mono">LOOT</span>BOX</p>
    </div>
  );
};