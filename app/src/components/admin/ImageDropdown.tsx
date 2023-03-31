/* eslint-disable @next/next/no-img-element */
import { OffChainPrize } from '@/types';
import { useState } from 'react';
const Icon = () => (
  <svg width="7" height="2" viewBox="0 0 7 2" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.5 2L1.75 1L2.28372e-07 -4.6199e-08L7 -4.76837e-07L3.5 2Z" fill="#65666B" />
  </svg>
);
const ImageDropdown = ({
  currentItem,
  items,
  setCurrentItem
}: {
  currentItem: OffChainPrize,
  items: Array<OffChainPrize>
  setCurrentItem: (item: OffChainPrize) => void,
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={'w-[180px] px-1 py-1 cursor-pointer relative flex justify-between items-center bg-white ' + (open ? 'rounded-t-md' : 'rounded-md')}>
      <div className='flex gap-1 w-full' onClick={() => setOpen(true)}>
        <img alt='' src={currentItem?.image} className='w-[25px] h-[25px] rounded-md' />
        <p className='text-black'>{currentItem?.name}</p>
      </div>
      <Icon />
      {open && <div className='absolute left-0 top-[100%] z-[100] flex flex-col bg-white rounded-b-md w-full'>
        {items.map((item) => (
          <div
            className='flex gap-1 px-1 py-0.5'
            key={item.index}
            onClick={() => {
              setCurrentItem(item);
              console.log(item);
              setOpen(false);
            }}
          >
            <img alt='' src={item.image} className='w-[25px] h-[25px] rounded-md' />
            <p className='text-black'>{item.name}</p>
          </div>
        ))}
        {open && <div className='fixed inset-0 -z-10' onClick={(e) => {
          e.stopPropagation();
          setOpen(false);
        }}></div>}
      </div>}
    </div>
  )
};

export default ImageDropdown;