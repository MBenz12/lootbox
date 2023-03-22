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

const client = new NFTStorage({ token: NFT_STORAGE_TOKEN })

const OffChainPrizeDialog = ({
  setOpen,
  prizes,
  setReload,
}: {
  setReload: (reload: {}) => void,
  setOpen: (open: boolean) => void,
  prizes: Array<OffChainPrize>,
}) => {
  const [name, setName] = useState('');
  const [image, setImage] = useState<string>();
  const [file, setFile] = useState<File>();
  const handleUpload = async () => {
    if (!file) return;
    const { ipnft } = await client.store({
      name,
      image: file,
      description: ''
    });
    const url = `https://${ipnft}.ipfs.nftstorage.link/metadata.json`;
    await axios.post('/api/storePrize', { url });
    setReload({});
  }
  return (
    <div className={"fixed z-20 flex justify-center place-items-center top-0 left-0 w-full h-full bg-[rgba(0,0,0,.9)]"} onClick={() => setOpen(false)}>
      <div className={"mx-auto border border-white rounded-xl max-w-[500px] w-full"} onClick={(e) => e.stopPropagation()}>
        <div className={"flex gap-5 my-5 ml-5"}>
          <p className={"text-[24px] font-bold"}>Off Chain Prizes</p>
        </div>
        {/* <div className='w-10 h-10 bg-cover bg-center bg-no-repeat' style={{ backgroundImage: `url(${image})` }}/> */}
        <div className='flex gap-2 mx-5 items-center justify-center'>
          Name: <Input
            size={"sm"}
            fullWidth
            onChange={(e) => setName(e.target.value)}
            value={name}
            name={`prize_name`}
          />
          <UploadImageInput
            image={image}
            handleChange={(e) => {
              const file = e.target.files?.[0];
              setFile(file);
              const reader = new FileReader();
              reader.onload = () => {
                setImage(reader.result?.toString() || undefined);
              }
              reader.readAsDataURL(file || new Blob());
            }}
            name={`image`}
          />
          <Button text='Upload' onClick={handleUpload} />
        </div>
        <div className={"flex justify-center flex-col items-center gap-2 my-5 mx-10"}>
          <div className='flex gap-2 w-full justify-between'>
            <div className='w-[20%]'>No</div>
            <div className='w-[60%]'>Name</div>
            <div className=''>Image</div>
          </div>
          {prizes.map((prize, index) => (
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default OffChainPrizeDialog;