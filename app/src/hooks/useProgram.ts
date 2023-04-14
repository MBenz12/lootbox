import { IDL, Lootbox } from '@/idl/lootbox';
import { programId } from '@/lootbox-program-libs/utils';
import { AnchorProvider, Program, } from '@project-serum/anchor';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { Keypair } from '@solana/web3.js';
import { useEffect, useState } from 'react';
import NodeWallet from '@project-serum/anchor/dist/cjs/nodewallet';

const useProgram = (generate?: boolean) => {
  const anchorWallet = useAnchorWallet();
  const {connection} = useConnection();
  const [program, setProgram] = useState<Program<Lootbox>>();
  
  useEffect(() => {
    if (!connection) return;
    if (!anchorWallet && !generate) return;
    const provider = new AnchorProvider(connection, anchorWallet || new NodeWallet(Keypair.generate()), AnchorProvider.defaultOptions());
    const program = new Program(IDL, programId.toString(), provider);
    setProgram(program);
  }, [anchorWallet, connection, generate]);

  return program;
};

export default useProgram;