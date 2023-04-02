/* eslint-disable @next/next/no-img-element */
import { Prizes } from '@/sections/open_box/Prizes'
import Head from 'next/head'
import LiveFeed from "@/components/LiveFeed";
import { useEffect, useMemo, useState } from "react";
import useFetchEvents from '@/hooks/useFetchEvents';
import { TOKENS } from '@/config';
import useFetchNfts from '@/hooks/useFetchNfts';
import useFetchPrizes from '@/hooks/useFetchPrizes';
import { NftPrize, SplPrize, OffChainPrize, WinnablePrize, OpenedPrize } from '@/types';
import { PublicKey } from '@solana/web3.js';
import { useRouter } from 'next/router'
import useFetchLootbox from '@/hooks/useFetchLootbox';
import { Button } from '@/components/open_box/Button';
import useProgram from '@/hooks/useProgram';
import { useWallet } from '@solana/wallet-adapter-react';
import { play } from '@/lootbox-program-libs/methods';
import { toast } from 'react-toastify';
import { PlayEvent } from '@/lootbox-program-libs/types';
import { getLootboxPda } from '@/lootbox-program-libs/utils';
import Box from "@/components/open_box/Box";

export default function Home() {
  const router = useRouter()
  const { lootbox: lootboxName } = router.query;

  const program = useProgram();
  const wallet = useWallet();
  const [reload, setReload] = useState({});
  const { lootbox } = useFetchLootbox(lootboxName as string, reload);

  const [event, setEvent] = useState<PlayEvent>();
  const { events } = useFetchEvents(reload);
  const { prizes: prizeItems } = useFetchPrizes(reload);
  const mints: Array<PublicKey> | undefined = useMemo(() => lootbox ? lootbox.splVaults.filter(splVault =>
    splVault.isNft && splVault.mint.toString() !== PublicKey.default.toString()
  ).map((splVault) => splVault.mint) : undefined, [lootbox]);

  const { nfts: lootboxNfts } = useFetchNfts(reload, mints);
  const { nftPrizes, splPrizes, offChainPrizes } = useMemo(() => {
    const nftPrizes: Array<Array<NftPrize>> = new Array(4).fill([]).map(() => []);
    const splPrizes: Array<Array<SplPrize>> = new Array(4).fill([]).map(() => []);
    const offChainPrizes: Array<Array<OffChainPrize>> = new Array(4).fill([]).map(() => []);
    if (lootbox) {
      lootbox.prizeItems.forEach((prizeItem) => {
        const { rarity } = prizeItem;
        if (prizeItem.onChainItem) {
          const { splIndex, amount: prizeAmount } = prizeItem.onChainItem;
          const { mint, isNft } = lootbox.splVaults[splIndex];
          if (isNft) {
            let index = lootboxNfts.map(nft => nft.mint.toString()).indexOf(mint.toString());
            nftPrizes[rarity].push({ index, lootbox: true, lootboxName: lootbox.name });
          } else {
            let tokenMints = TOKENS.map(token => token.mint.toString());
            let tokenIndex = tokenMints.indexOf(mint.toString());
            let decimals = TOKENS[tokenIndex].decimals;
            splPrizes[rarity].push({ index: tokenIndex, lootbox: true, amount: prizeAmount.toNumber() / decimals, lootboxName: lootbox.name });
          }
        } else if (prizeItem.offChainItem) {
          const { itemIndex, totalItems, usedItems } = prizeItem.offChainItem;
          if (totalItems === usedItems) return;

          const { name, image } = prizeItems[itemIndex] || { name: '', image: '' };
          offChainPrizes[rarity].push({
            itemIndex,
            name,
            image,
            totalItems,
            remainigItems: totalItems - usedItems,
            lootbox: true,
            lootboxName: lootbox.name,
          });
        }
      });
    }
    return { nftPrizes, splPrizes, offChainPrizes };
  }, [lootbox, prizeItems, lootboxNfts]);

  const prizes = useMemo(() => {
    const prizes: Array<WinnablePrize> = [];
    for (let rarity = 0; rarity < 4; rarity++) {
      for (const prize of nftPrizes[rarity]) {
        if (!lootboxNfts[prize.index]) continue;
        const { name, image, floorPrice } = lootboxNfts[prize.index];
        prizes.push({
          rarity,
          name,
          image,
          lootbox: prize.lootboxName || '',
          value: floorPrice
        });
      }
      for (const prize of splPrizes[rarity]) {
        const { symbol, image } = TOKENS[prize.index];
        prizes.push({
          rarity,
          name: symbol,
          lootbox: prize.lootboxName || '',
          image,
          value: prize.amount,
        })
      }
      for (const prize of offChainPrizes[rarity]) {
        if (!prizeItems[prize.itemIndex]) continue;
        const { name, image } = prizeItems[prize.itemIndex];
        prizes.push({
          rarity,
          name,
          image,
          value: 0,
          lootbox: prize.lootboxName || '',
        })
      }
    }
    return prizes;
  }, [nftPrizes, splPrizes, offChainPrizes, lootboxNfts, prizeItems]);

  const [openedPrize, setOpenedPrize] = useState<OpenedPrize>();

  const handlePlay = async () => {
    if (!wallet.publicKey || !program || !lootbox) {
      return;
    }

    setShowPrize(false);

    const txn = await play(
      program,
      lootbox.name,
      wallet,
      lootbox.feeWallet,
      lootbox.ticketMint,
      lootbox.ticketPrice,
    );

    if (txn) {
      toast.success('Played successfully');
    } else {
      toast.error('Failed to play');
    }
  }

  useEffect(() => {
    if (program) {
      const listenerId = program.addEventListener('PlayEvent', (event: PlayEvent) => {
        setEvent(event);
        setReload({});
      });
      console.log('listener: ', listenerId);
    }
  }, [program]);

  useEffect(() => {
    if (!lootbox || !wallet.publicKey) return;
    if (event) {
      const { player, lootbox: lootboxKey, prizeItem: { offChainItem, onChainItem, rarity } } = event;
      if (player.toString() !== wallet.publicKey.toString() || getLootboxPda(lootbox.name)[0].toString() !== lootboxKey.toString()) {
        return;
      }
      let data: any;
      if (offChainItem) {
        const { image, name } = prizeItems[offChainItem.itemIndex];
        data = { image, name };
      }
      if (onChainItem) {
        const { splIndex, amount: prizeAmount } = onChainItem;
        const { mint, isNft } = lootbox.splVaults[splIndex];
        if (isNft) {
          let index = lootboxNfts.map(nft => nft.mint.toString()).indexOf(mint.toString());
          const { name, image } = lootboxNfts[index];
          data = { name, image, mint: mint.toString() };
        } else {
          let tokenMints = TOKENS.map(token => token.mint.toString());
          let tokenIndex = tokenMints.indexOf(mint.toString());
          const { symbol, image, decimals } = TOKENS[tokenIndex];
          const amount = prizeAmount.toNumber() / decimals;
          data = { image, symbol, amount, mint: mint.toString() };
        }
      }

      setOpenedPrize({ image: data.image, rarity })
      setShowPrize(true);
    } else {
      setShowPrize(false);
    }
  }, [event, lootbox, lootboxNfts, prizeItems, wallet.publicKey]);

  const divider = "after:absolute after:bottom-0 after:left-0 after:right-0 after:w-[100%] after:h-[2px] after:bg-gradient-purple-divider"
  const [showPrize, setShowPrize] = useState(false);

  return (
    <>
      <Head>
        <title>Lootbox</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="px-5 lg:px-32">
        <div className={"relative flex justify-center w-full h-auto min-h-[300px] mb-10 overflow-hidden " + divider}>
          <h1 className={"font-akira font-[800] text-2xl md:text-4xl lg:text-6xl absolute"}>
            <span className={"font-akira font-[800] text-2xl md:text-4xl lg:text-6xl text-[#E93E67] uppercase"}>{lootboxName}</span> BOX
          </h1>
          <img className={"aspect-[1.6] object-cover h-full"} src="/images/open_box_mask.png" alt="open_box_mask" draggable={false} />
          <Box showPrize={showPrize} prize={openedPrize} boxImage={"/images/opened_lootbox.png"} />
          <div className={"absolute flex flex-col place-items-center bottom-[2%]"}>
            <Button text={"Open"} handler={() => handlePlay()} />
            <div className={"flex gap-1 place-items-center"}>
              <img className={"w-[18px] h-[18px]"} src="/images/coin.png" alt="coin" />
              <p className={"opacity-50"}>750 ZEN</p>
            </div>
          </div>
        </div>
        {<Prizes prizes={prizes} lootbox={lootbox} />}
        <LiveFeed events={events} />
      </div>
    </>
  )
}
