import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { NftData } from "@/types";
import { Metaplex } from "@metaplex-foundation/js";
import { PublicKey } from "@solana/web3.js";
import { HyperspaceClient } from "hyperspace-client-js";
import { HYPERSPACE_API_KEY } from '@/config';

const hsClient = new HyperspaceClient(HYPERSPACE_API_KEY);

const useFetchNfts = (reload: {}, mints?: Array<PublicKey>): { nfts: Array<NftData>, loading: boolean } => {
  const wallet = useWallet();
  const { connection } = useConnection();

  const metaplex = useMemo(() => new Metaplex(connection), [connection]);

  const [nfts, setNfts] = useState<Array<NftData>>([]);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      let allNfts;
      if (!mints) {
        if (!wallet.publicKey) {
          setLoading(false);
          return;
        }
        allNfts = await metaplex.nfts().findAllByOwner({ owner: wallet.publicKey });
      } else {
        allNfts = (await metaplex.nfts().findAllByMintList({ mints })).filter(nft => nft);
      }

      allNfts.sort((a: any, b: any) => {
        if (a.name === b.name) return 0;
        return a.name > b.name ? 1 : -1;
      });

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
      setNfts(nfts);

      let fetchPrices = [];
      for (let i = 0; i < Object.keys(creators).length; i += 10) {
        fetchPrices.push(async () => {
          try {
            const res = await hsClient.getProjects({ condition: { projectIds: Object.keys(creators).slice(i, i + 10) } });
            for (const project of res.getProjectStats.project_stats || []) {
              const creator = project.project_id;
              creators[creator] = project.floor_price || 0;
            }            
          } catch (error) {
            console.log(error);
          }
        });
      }

      let newNfts = nfts.map(nft => ({ ...nft }));
      await Promise.all(
        allNfts.map(async (nft, index) => {
          try {
            if (!nft || !nft.uri) return;
            const { data } = await axios.get(nft.uri);
            const { image, name } = data;
            newNfts[index].image = image;
            newNfts[index].name = name;
          } catch (error) {
            // console.log(error);
          }
        }).concat(fetchPrices.map(async (fetchPrice) => await fetchPrice()))
      );

      for (const nft of newNfts) {
        nft.floorPrice = creators[nft.creator.toString()];
      }
      setNfts(newNfts);

    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  }, [metaplex, wallet.publicKey, mints]);

  useEffect(() => {
    fetch();
  }, [wallet.publicKey, metaplex, fetch, reload, mints]);

  return { nfts, loading };
};

export default useFetchNfts;