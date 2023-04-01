import { Banner } from '@/sections/lootboxes/Banner'
import { Boxes } from '@/sections/lootboxes/Boxes'
import { Prizes } from '@/sections/lootboxes/Prizes'
import Head from 'next/head'
import LiveFeed from "@/components/LiveFeed";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import useProgram from '@/hooks/useProgram';
import useFetchAllLootboxes from '@/hooks/useFetchAllLootboxes';
import useFetchEvents from '@/hooks/useFetchEvents';
import { TOKENS } from '@/config';
import useFetchNfts from '@/hooks/useFetchNfts';
import useFetchPrizes from '@/hooks/useFetchPrizes';
import { PlayEvent } from '@/lootbox-program-libs/types';
import { NftPrize, SplPrize, OffChainPrize, WinnablePrize } from '@/types';
import { getLootbox } from '@/utils';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import axios from 'axios';

export default function Home() {
  const [reload, setReload] = useState({});
  const { lootboxes } = useFetchAllLootboxes(reload);
  const { events } = useFetchEvents(reload);

  const program = useProgram();
  const { prizes: prizeItems } = useFetchPrizes(reload);
  const { publicKey } = useWallet();
  const mints = useMemo(() => {
    const mints: Array<PublicKey> = [];
    lootboxes.forEach(lootbox => {
      mints.push(...lootbox.splVaults.filter(splVault => splVault.isNft && splVault.mint.toString() !== PublicKey.default.toString()).map((splVault) => splVault.mint));
    });
    return mints;
  }, [lootboxes]);
  const { nfts: lootboxNfts } = useFetchNfts(reload, mints);
  const { nftPrizes, splPrizes, offChainPrizes } = useMemo(() => {
    const nftPrizes: Array<Array<NftPrize>> = new Array(4).fill([]).map(() => []);
    const splPrizes: Array<Array<SplPrize>> = new Array(4).fill([]).map(() => []);
    const offChainPrizes: Array<Array<OffChainPrize>> = new Array(4).fill([]).map(() => []);
    for (const lootbox of lootboxes) {
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
  }, [lootboxes, prizeItems, lootboxNfts]);

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


  // const eventListener = useCallback(
  //   async (event: PlayEvent, slot: number, signature: string) => {
  //     console.log(signature);
  //     const { lootbox: lootboxKey, prizeItem: { offChainItem, onChainItem, rarity }, timestamp } = event;
  //     const lootbox = getLootbox(lootboxKey, lootboxes);
  //     const lootboxName = lootbox.name;
  //     let data: any;
  //     if (offChainItem) {
  //       const { image, name } = prizeItems[offChainItem.itemIndex];
  //       data = { image, name };
  //     }
  //     if (onChainItem) {
  //       const { splIndex, amount: prizeAmount } = onChainItem;
  //       const { mint, isNft } = lootbox.splVaults[splIndex];
  //       if (isNft) {
  //         let index = lootboxNfts.map(nft => nft.mint.toString()).indexOf(mint.toString());
  //         const { name, image } = lootboxNfts[index];
  //         data = { name, image, mint: mint.toString() };
  //       } else {
  //         let tokenMints = TOKENS.map(token => token.mint.toString());
  //         let tokenIndex = tokenMints.indexOf(mint.toString());
  //         const { symbol, image, decimals } = TOKENS[tokenIndex];
  //         const amount = prizeAmount.toNumber() / decimals;
  //         data = { image, symbol, amount, mint: mint.toString() };
  //       }
  //     }
  //     await axios.post('/api/played', { signature, lootboxName, rarity, timestamp: timestamp.toNumber(), user: publicKey?.toString() , ...data, });
  //     setReload({});
  //   },
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   [lootboxes, prizeItems, lootboxNfts, publicKey],
  // )

  // useEffect(() => {
  //   if (!program) return;
  //   const listenerId = program.addEventListener('PlayEvent', eventListener);
  //   console.log("added event listener: ", listenerId);
  //   return () => {
  //     // console.log("remove event listener:", listenerId);
  //     // program.removeEventListener(listenerId);
  //   }
  // }, [program, eventListener]);
  return (
    <>
      <Head>
        <title>Lootbox</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="px-5 lg:px-32">
        <Banner />
        <Prizes prizes={prizes} />
        <Boxes lootboxes={lootboxes} />
        <LiveFeed events={events} />
      </div>
    </>
  )
}
