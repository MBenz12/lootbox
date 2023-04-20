import { TOKENS } from '@/config';
import { getAssociatedTokenAddressSync } from '@solana/spl-token';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useCallback, useEffect, useState } from 'react';

const useFetchBalance = (reload: {}): { balance: number, loading: boolean } => {
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  const fetchPrizes = useCallback(async () => {
    if (!connection || !publicKey) return;
    setLoading(true);
    try {
      const mint = new PublicKey(TOKENS[2].mint);
      const ata = getAssociatedTokenAddressSync(mint, publicKey);
      const { value: { uiAmount } } = await connection.getTokenAccountBalance(ata);
      setBalance(uiAmount || 0);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }, [connection, publicKey]);

  useEffect(() => {
    fetchPrizes();
  }, [reload, fetchPrizes]);

  return { balance, loading };
};

export default useFetchBalance;