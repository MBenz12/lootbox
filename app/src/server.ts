import { AnchorProvider, Program, Wallet } from '@project-serum/anchor';
import { Lootbox as LootboxIDL } from './idl/lootbox';
import { programId } from './lootbox-program-libs/utils';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { SOLANA_DEVNET_RPC_URL, TOKENS } from './config';
import { Metaplex } from '@metaplex-foundation/js';
import { NftData } from './types';
import axios from 'axios';
import { Lootbox, PlayEvent } from './lootbox-program-libs/types';
import { getLootbox } from './utils';
import PlayEventModel from './db/models/PlayEvent';
import Prize from './db/models/Prize';
import connect from './db/connect';

const idl = require('./idl/lootbox.json');
const connection = new Connection(SOLANA_DEVNET_RPC_URL);
const provider = new AnchorProvider(connection, new Wallet(Keypair.generate()), AnchorProvider.defaultOptions());
const program = new Program(idl, programId.toString(), provider) as Program<LootboxIDL>;
const metaplex = new Metaplex(connection);

const setupListener = () => {
  const listenerId = program.addEventListener('PlayEvent', listener);
  console.log('Event Listener added. Id: ', listenerId);
}

const listener = async (event: PlayEvent, slot: number, signature: string) => {
  const lootboxes = (await program.account.lootbox.all()).map((lootbox) => lootbox.account as Lootbox);
  const mints: Array<PublicKey> = [];
  lootboxes.forEach(lootbox => {
    mints.push(...lootbox.splVaults.filter(splVault => splVault.isNft && splVault.mint.toString() !== PublicKey.default.toString()).map((splVault) => splVault.mint));
  });
  await connect();
  const [lootboxNfts, prizeItems] = await Promise.all([getNfts(mints), getPrizes()]);

  const { player, lootbox: lootboxKey, prizeItem: { offChainItem, onChainItem, rarity }, timestamp } = event;
  const lootbox = getLootbox(lootboxKey, lootboxes);
  const lootboxName = lootbox.name;
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

  const playEvent = { signature, lootboxName, rarity, timestamp: timestamp.toNumber(), user: player , ...data, };
  await PlayEventModel.create(playEvent);
}

const getNfts = async (mints: Array<PublicKey>) => {
  const allNfts = await metaplex.nfts().findAllByMintList({ mints });
  const nfts: Array<NftData> = allNfts.map(nft => {
    const creator = nft?.creators.length ? nft?.creators[0].address : PublicKey.default;
    return {
      // @ts-ignore
      mint: nft.mintAddress as PublicKey,
      name: nft?.name || '',
      image: "",
      floorPrice: 0,
      creator,
    };
  });

  await Promise.all(
    allNfts.map(async (nft, index) => {
      try {
        if (!nft || !nft.uri) return;
        const { data } = await axios.get(nft.uri);
        const { image } = data;
        nfts[index].image = image;
      } catch (error) {
        console.log(error);
      }
    })
  );

  nfts.sort((a: NftData, b: NftData) => {
    if (a.name === b.name) return 0;
    return a.name > b.name ? 1 : -1;
  });

  return nfts;
}

const getPrizes = async () => {
  const prizeItems = await Prize.find();
  const prizes = await Promise.all(prizeItems.map((async (prize: { url: string }, index: number) => {
    const { data: metadata } = await axios.get(prize.url);
    const list = metadata.image.split('/');
    return {
      index,
      name: metadata.name,
      image: `https://${list[2]}.ipfs.nftstorage.link/${list[3]}`,
    };
  })));

  return prizes;
}

setupListener();