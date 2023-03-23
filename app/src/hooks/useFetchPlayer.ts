import { Player } from '@/lootbox-program-libs/types';
import { getPlayerPda } from '@/lootbox-program-libs/utils';
import { useWallet } from '@solana/wallet-adapter-react';
import { useCallback, useEffect, useState } from 'react';
import useProgram from './useProgram';

const useFetchPlayer = (reload: {}) => {
  const program = useProgram();
  const [player, setPlayer] = useState<Player>();
  const [loading, setLoading] = useState(false);
  const wallet = useWallet();

  const fetch = useCallback(async () => {
    if (!wallet.publicKey || !program) return;

    setLoading(true);
    try {
      const [player] = await getPlayerPda(wallet.publicKey);
      const playerData: Player = await program.account.player.fetch(player);
      setPlayer(playerData);
    } catch (error) {
      console.log(false);
    }
    setLoading(false);
  }, [program, wallet.publicKey]);

  useEffect(() => {
    fetch();
  }, [program, reload, fetch]);

  return { player, loading }
};

export default useFetchPlayer;