/* eslint-disable @next/next/no-img-element */
import { Claim, OffChainPrize } from '@/types';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const ClaimsDialog = ({
  claims,
  prizes,
  setOpen,
  setReload,
}: {
  claims: Array<Claim>,
  prizes: Array<OffChainPrize>,
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
            <div className='w-[20%]'></div>
            <div className='w-[30%]'>Discord User</div>
            <div className='w-[40%]'>Prize Name</div>
          </div>
          {claims.map((claim, index) => (
            <div key={`claim-${index}`} className='flex gap-2 items-center w-full justify-between'>
              <div className='w-[20%]'>{index + 1}</div>
              <div className='w-[30%]'>{claim.username}</div>
              <div className='w-[30%]'>{prizes[claim.itemIndex].name}</div>
              <div className='w-10 h-10 rounded-md'>
                <LazyLoadImage
                  alt=''
                  effect='blur'
                  src={prizes[claim.itemIndex].image}
                  className='rounded-md'
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClaimsDialog;