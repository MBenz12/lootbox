/* eslint-disable @next/next/no-img-element */
import { useState } from 'react';
import Button from './Button';
import Input from './Input';
import UploadImageInput from './UploadImageInput';
import { NFTStorage } from 'nft.storage';
import { NFT_STORAGE_TOKEN } from '@/config';
import axios from 'axios';
import { OffChainPrize } from '@/types';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const ClaimsDialog = ({
  setOpen,
  setReload,
}: {
  setReload: (reload: {}) => void,
  setOpen: (open: boolean) => void,
}) => {
  
  return (
    <div className={"fixed z-20 flex justify-center place-items-center top-0 left-0 w-full h-full bg-[rgba(0,0,0,.9)]"} onClick={() => setOpen(false)}>
      <div className={"mx-auto border border-white rounded-xl max-w-[500px] w-full"} onClick={(e) => e.stopPropagation()}>
        <div className={"flex gap-5 my-5 ml-5"}>
          <p className={"text-[24px] font-bold"}>Off-Chain Item Claims</p>
        </div>
        
        <div className={"flex justify-center flex-col items-center gap-2 my-5 mx-10"}>
          <div className='flex gap-2 w-full justify-between'>
            <div className='w-[40%]'>Prize Name</div>
            <div className='w-[60%]'>Discord User</div>
          </div>
          {/* {prizes.map((prize, index) => (
            <div key={prize.index} className='flex gap-2 items-center w-full justify-between'>
              <div className='w-[20%]'>{index + 1}</div>
              <div className='w-[60%]'>{prize.name}</div>
              <div className='w-10 h-10 rounded-md'>
                <LazyLoadImage
                  alt=''
                  effect='blur'
                  src={prize.image}
                  className='rounded-md'
                />
              </div>
            </div>
          ))} */}
        </div>
      </div>
    </div>
  );
};

export default ClaimsDialog;