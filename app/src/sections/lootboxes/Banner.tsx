import Carousel from '@/components/lootboxes/Carousel';
import React from 'react';
const slides = [
  '/images/banner1.png',
  '/images/banner2.png',
  '/images/banner3.png',
];

export const Banner: React.FC = () => {
  return (
    <div className="relative banner overflow-hidden">
      <div className='absolute left-0 top-0 w-full h-full -z-10'>
        <Carousel slides={slides} interval={5000} />
      </div>
      <div className='absolute left-0 -top-[50%] -translate-x-[50%] w-[400px] h-[200%] bg-[#0b0c1a] blur-[50px] -z-[5] sm:block hidden'></div>
      <div className='absolute right-0 -top-[50%] translate-x-[50%] w-[400px] h-[200%] bg-[#0b0c1a] blur-[50px] -z-[5] sm:block hidden'></div>
      <p className="font-extrabold uppercase text-[62px] font-akira leading-tight pt-[20px] lg:text-[110px] lg:pt-[40px]">UKIYO</p>
      <p className="text-[22px] font-america-mono mt-[-13px] lg:text-[36px] lg:mt-[-20px]"><span className="text-[#FF6C6C] font-america-mono">LOOT</span>BOX</p>
    </div>
  );
};