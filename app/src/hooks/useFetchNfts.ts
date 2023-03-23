import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { NftData } from "@/types";
import { Metaplex } from "@metaplex-foundation/js";
import { PublicKey } from "@solana/web3.js";
import { HyperspaceClient } from "hyperspace-client-js";
import { HYPERSPACE_API_KEY } from '@/config';
import { Lootbox } from '@/lootbox-program-libs/types';

const hsClient = new HyperspaceClient(HYPERSPACE_API_KEY);

const useFetchNfts = (reload: {}, lootbox?: Lootbox): { nfts: Array<NftData>, loading: boolean } => {
  const wallet = useWallet();
  const { connection } = useConnection();

  const metaplex = useMemo(() => new Metaplex(connection), [connection]);

  const [nfts, setNfts] = useState<Array<NftData>>([]);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async (lootbox?: Lootbox) => {
    if (!wallet.publicKey) {
      return;
    }
    setLoading(true);
    try {
      let allNfts;
      if (!lootbox) {
        allNfts = await metaplex.nfts().findAllByOwner({ owner: wallet.publicKey });
      } else {
        const mints = lootbox.splVaults.filter(splVault => splVault.amount.toNumber() === 1).map((splVault) => splVault.mint);
        allNfts = (await metaplex.nfts().findAllByMintList({ mints })).filter(nft => nft);
      }
      const creators: { [key: string]: number } = {};
      const nfts: Array<NftData> = allNfts.map(nft => {
        const creator = nft?.creators.length ? nft?.creators[0].address : PublicKey.default;
        creators[creator.toString()] = 0;
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

      try {
        const res = await hsClient.getProjects({ condition: { projectIds: Object.keys(creators) } });
        for (const project of res.getProjectStats.project_stats || []) {
          const creator = project.project_id;
          creators[creator] = project.floor_price || 0;
        }
  
        for (const nft of nfts) {
          nft.floorPrice = creators[nft.creator.toString()];
        }        
      } catch (error) {
        console.log(error);
      }


      nfts.sort((a: NftData, b: NftData) => {
        if (a.name === b.name) return 0;
        return a.name > b.name ? 1 : -1;
      });

      setNfts(nfts);
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  }, [metaplex, wallet.publicKey]);

  useEffect(() => {
    fetch(lootbox);
  }, [wallet.publicKey, metaplex, fetch, reload, lootbox]);

  return { nfts, loading };
};

export default useFetchNfts;