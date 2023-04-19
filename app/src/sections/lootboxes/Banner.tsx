import React from 'react';

export const Banner: React.FC = () => {
  return (
    <div className="relative right-1/2 left-1/2 translate-x-[-50%] min-h-[360px] banner">
      <p className="font-extrabold uppercase text-[100px] font-akira scale-y-[0.75] leading-tight lg:text-[120px]">UKIYO</p>
      <p className="text-[38px] font-america-mono mt-[-20px] ml-[8px] lg:text-[36px] lg:mt-[-30px]"><span className="text-[#FF6C6C] font-america-mono">LOOT</span>BOX</p>
    </div>
  );
};