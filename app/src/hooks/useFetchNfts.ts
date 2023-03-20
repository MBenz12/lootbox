/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { NftData } from "@/types";
import { Metaplex } from "@metaplex-foundation/js";
import { PublicKey } from "@solana/web3.js";
import { HyperspaceClient } from "hyperspace-client-js";
import { HYPERSPACE_API_KEY } from '@/config';

const hsClient = new HyperspaceClient(HYPERSPACE_API_KEY);

const useFetchNfts = (reload: {}, mints?: Array<PublicKey>): { nfts: Array<NftData> } => {
  const wallet = useWallet();
  const { connection } = useConnection();

  const metaplex = useMemo(() => new Metaplex(connection), [connection]);

  const [nfts, setNfts] = useState<Array<NftData>>([]);

  const fetch = useCallback(async () => {
    if (!wallet.publicKey) {
      return;
    }
    try {
      let allNfts;
      if (!mints) {
        allNfts = await metaplex.nfts().findAllByOwner({ owner: wallet.publicKey });

      } else {
        allNfts = (await metaplex.nfts().findAllByMintList({ mints })).filter(nft => nft);
      }

      const nfts: Array<NftData> = allNfts.map(nft => ({
        // @ts-ignore
        mint: nft.mintAddress as PublicKey,
        name: nft?.name || '',
        image: "",
        floorPrice: 0,
        creator: nft?.creators[0].address || PublicKey.default,
      }));

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

      const res = await hsClient.getProjects({ condition: { projectIds: nfts.map(nft => nft.creator.toString()) } });
      let index = 0;
      for (const project of res.getProjectStats.project_stats || []) {
        nfts[index++].floorPrice = project.floor_price || 0;
      }

      nfts.sort((a: NftData, b: NftData) => {
        if (a.name === b.name) return 0;
        return a.name > b.name ? 1 : -1;
      });

      setNfts(nfts);
    } catch (error) {
      console.log(error);
    }
  }, [metaplex, wallet.publicKey]);

  useEffect(() => {
    fetch();
  }, [wallet.publicKey, metaplex, fetch, reload]);

  return { nfts };
};

export default useFetchNfts;