/* eslint-disable @next/next/no-img-element */
import React, { useMemo, useState } from 'react';
import Heading from "../sections/claim/Heading";
import NFTCard from "../components/claim/NFTCard";
import CardsSection from "../sections/claim/CardsSection";
import { ModalContext } from "@/contexts/modal-context";
import Head from "next/head";
import LiveFeed from "@/components/LiveFeed";
import useFetchPlayer from '@/hooks/useFetchPlayer';
import { NftPrize, OffChainPrize, SplPrize } from '@/types';
import useFetchPrizes from '@/hooks/useFetchPrizes';
import { PublicKey } from '@solana/web3.js';
import useFetchNfts from '@/hooks/useFetchNfts';
import { TOKENS } from '@/config';
import useFetchAllLootboxes from '@/hooks/useFetchAllLootboxes';
import { Button } from '@/components/lootboxes/Button';
import useProgram from '@/hooks/useProgram';
import { useWallet } from '@solana/wallet-adapter-react';
import { claim, claimAll } from '@/lootbox-program-libs/methods';
import { toast } from 'react-toastify';
import { getLootbox, isClaimed } from '@/utils';
import useFetchEvents from '@/hooks/useFetchEvents';
import useFetchUserClaims from '@/hooks/useFetchUserClaims';
import { getCookie } from 'cookies-next'

type PrizeCard = { prize: NftPrize | SplPrize | OffChainPrize, name: string, image: string, lootbox: string, value: number };

export async function getServerSideProps(context: any) {
  const discord_access = getCookie("discord_access", context);
  return {
    props: {
      discordAccess: discord_access === undefined ? null : discord_access,
    },
  };
}

const Claim = ({ discordAccess }: { discordAccess: string | undefined }) => {
  const program = useProgram();
  const wallet = useWallet();
  const [reload, setReload] = useState({});
  const { lootboxes } = useFetchAllLootboxes(reload);
  const { player } = useFetchPlayer(reload);
  const { events } = useFetchEvents(reload);
  const { claims } = useFetchUserClaims(reload);

  const { prizes: prizeItems } = useFetchPrizes(reload);
  const mints = useMemo(() => {
    const mints: Array<PublicKey> = [];
    lootboxes.forEach(lootbox => {
      mints.push(...lootbox.splVaults.filter(splVault => splVault.isNft && splVault.mint.toString() !== PublicKey.default.toString()).map((splVault) => splVault.mint));
    });
    return mints;
  }, [lootboxes]);
  const { nfts: lootboxNfts } = useFetchNfts(reload, mints);

  const { nftPrizes, splPrizes, offChainPrizes } = useMemo(() => {
    const nftPrizes: Array<NftPrize> = [];
    const splPrizes: Array<SplPrize> = [];
    const offChainPrizes: Array<OffChainPrize> = [];

    if (player) {
      for (const playerBox of player.lootboxes) {
        const lootbox = getLootbox(playerBox.lootbox, lootboxes);
        if (!lootbox) continue;
        for (const onChainPrize of playerBox.onChainPrizes) {
          const { splIndex, amount: prizeAmount } = onChainPrize;
          const { mint, isNft } = lootbox.splVaults[splIndex];
          if (isNft) {
            let index = lootboxNfts.map(nft => nft.mint.toString()).indexOf(mint.toString());
            nftPrizes.push({ index, lootbox: true, lootboxName: lootbox.name });
          } else {
            let tokenMints = TOKENS.map(token => token.mint.toString());
            let tokenIndex = tokenMints.indexOf(mint.toString());
            let decimals = TOKENS[tokenIndex].decimals;
            let index = splPrizes.map(prize => prize.index).indexOf(tokenIndex);
            if (index === -1) {
              splPrizes.push({ index: tokenIndex, lootbox: true, amount: prizeAmount.toNumber() / decimals, lootboxName: lootbox.name });
            } else {
              splPrizes[index].amount += prizeAmount.toNumber() / decimals;
            }
          }
        }

        for (let prizeIndex = 0; prizeIndex < playerBox.offChainPrizes.length; prizeIndex++) {
          const { itemIndex, totalItems, usedItems, claimed } = playerBox.offChainPrizes[prizeIndex];
          if (claimed) {
            continue;
          }
          const { name, image } = prizeItems[itemIndex] || { name: '', image: '' };
          offChainPrizes.push({
            itemIndex,
            prizeIndex,
            name,
            image,
            totalItems,
            remainigItems: totalItems - usedItems,
            lootbox: true,
            lootboxName: lootbox.name,
          });
        }
      }
    }

    return { nftPrizes, splPrizes, offChainPrizes };
  }, [player, lootboxNfts, lootboxes, prizeItems]);

  const { showModal } = React.useContext(ModalContext)

  const { splCards, nftCards, offChainCards } = useMemo(() => {
    const splCards: Array<PrizeCard> = [];
    const nftCards: Array<PrizeCard> = [];
    const offChainCards: Array<PrizeCard> = [];
    for (const prize of nftPrizes) {
      if (!lootboxNfts[prize.index]) continue;
      const { name, image, floorPrice } = lootboxNfts[prize.index];
      nftCards.push({
        prize,
        name,
        image,
        lootbox: prize.lootboxName || '',
        value: floorPrice
      });
    }
    for (const prize of splPrizes) {
      if (!TOKENS[prize.index]) continue;
      const { symbol, image } = TOKENS[prize.index];
      splCards.push({
        prize,
        name: symbol,
        lootbox: prize.lootboxName || '',
        image,
        value: prize.amount,
      })
    }
    for (const prize of offChainPrizes) {
      if (!prizeItems[prize.itemIndex]) continue;
      const { name, image } = prizeItems[prize.itemIndex];
      offChainCards.push({
        prize,
        name,
        image,
        value: 0,
        lootbox: prize.lootboxName || '',
      })
    }
    return { splCards, nftCards, offChainCards };

  }, [nftPrizes, splPrizes, offChainPrizes, lootboxNfts, prizeItems]);

  const handleClaimNft = async (prize: NftPrize) => {
    if (!wallet.publicKey || !program || !prize.lootboxName) {
      return;
    }
    const mint = lootboxNfts[prize.index].mint;
    const txn = await claim(
      program,
      prize.lootboxName,
      wallet,
      mint,
    );

    if (txn) {
      toast.success('Claimed prize successfully');
      setReload({});
    } else {
      toast.error('Failed to claim prize');
    }
  }

  const handleClaimSpl = async (prize: SplPrize) => {
    if (!wallet.publicKey || !program || !player) {
      return;
    }
    const boxNames = player.lootboxes.map(playerBox => {
      const lootbox = getLootbox(playerBox.lootbox, lootboxes);
      return lootbox.name;
    });
    const mints = new Array(boxNames.length).fill(TOKENS[prize.index].mint);
    const txn = await claimAll(
      program,
      boxNames,
      wallet,
      mints,
    );

    if (txn) {
      toast.success('Claimed prize successfully');
      setReload({});
    } else {
      toast.error('Failed to claim prize');
    }
  }

  const handleClaimAll = async () => {
    if (!wallet.publicKey || !program || !player) {
      return;
    }

    const boxNames: Array<string> = [];
    const mints: Array<PublicKey> = [];
    for (const prize of splPrizes) {
      boxNames.push(...player.lootboxes.map(playerBox => {
        const lootbox = getLootbox(playerBox.lootbox, lootboxes);
        return lootbox.name;
      }));
      mints.push(...new Array(boxNames.length).fill(TOKENS[prize.index].mint));
    }

    for (const prize of nftPrizes) {
      if (!prize.lootboxName) continue;
      const mint = lootboxNfts[prize.index].mint;
      mints.push(mint);
      boxNames.push(prize.lootboxName);
    }

    if (!boxNames.length) return;
    
    const txn = await claimAll(
      program,
      boxNames,
      wallet,
      mints,
    );

    if (txn) {
      toast.success('Claimed prize successfully');
      setReload({});
    } else {
      toast.error('Failed to claim prize');
    }
  }

  return (
    <>
      <Head>
        <title>Claim Prizes</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex justify-center">
        <div className='container'>
          <Heading handleClaimAll={handleClaimAll} />
          <div className={"my-5"}>
            <p className={"font-bold font-space-mono text-[18px] my-5"}>TOKENS</p>
            {splCards.map((card, index) => (
              <div className={"flex place-items-center gap-2"} key={"token" + index}>
                <img width={16} height={16} className={"w-[16px] h-[16px]"} src={card.image} alt="" />
                <p className={"font-space-mono"}>{card.value} {card.name}</p>
                <Button handler={() => handleClaimSpl(card.prize as SplPrize)} text={"CLAIM"} />
              </div>
            ))}
          </div>
          <CardsSection sectionName={'NFTs'}>
            {
              nftCards.map((card, index) => {
                return (
                  <NFTCard key={index} name={card.name} box={card.lootbox} image={card.image} handler={() => {
                    handleClaimNft(card.prize as NftPrize);
                  }} />
                )
              })
            }
          </CardsSection>
          <CardsSection sectionName={'Other Prizes'}>
            {
              offChainCards.map((card, index) => {
                return (
                  <NFTCard key={index} name={card.name} box={card.lootbox} image={card.image} claimed={isClaimed(claims, card.prize as OffChainPrize)} handler={() => {
                    showModal(
                      <NFTCard key={`modal${index}`} image={card.image} name={card.name} discordAccess={discordAccess} claiming prize={(card.prize as OffChainPrize)} />
                    )
                  }} />
                )
              })
            }
          </CardsSection>
        </div>
      </div>
      <LiveFeed events={events} />
    </>
  );
};

export default Claim;