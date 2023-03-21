import useFetchNfts from '@/hooks/useFetchNfts';
import { IDL, Lootbox as LootboxIDL } from '@/idl/lootbox';
import { addItems, createLootbox, createPlayer, drain, fund, updateLootbox } from '@/lootbox-program-libs/methods';
import { OffChainItem, Rarity } from '@/lootbox-program-libs/types';
import { programId } from '@/lootbox-program-libs/utils';
import { AnchorProvider, BN, Program } from '@project-serum/anchor';
import { getMint, NATIVE_MINT } from '@solana/spl-token';
import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { WalletConnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { TOKENS } from '@/config';
import useFetchLootbox from '@/hooks/useFetchLootbox';
import { TOKEN } from '@/types';

export default function Admin() {
  const [program, setProgram] = useState<Program<LootboxIDL>>();
  const anchorWallet = useAnchorWallet();
  const wallet = useWallet();
  const { connection } = useConnection();

  useEffect(() => {
    if (!connection || !anchorWallet) return;

    const provider = new AnchorProvider(connection, anchorWallet, AnchorProvider.defaultOptions());
    const program = new Program(IDL, programId.toString(), provider);
    setProgram(program);
  }, [connection, anchorWallet]);

  const [fee, setFee] = useState(0);
  const [feeWallet, setFeeWallet] = useState("3qWq2ehELrVJrTg2JKKERm67cN6vYjm1EyhCEzfQ6jMd");
  const [name, setName] = useState("lootbox");
  const [ticketMint, setTicketMint] = useState(NATIVE_MINT);
  const [ticketPrice, setTicketPrice] = useState(0);
  const [decimals, setDecimals] = useState(1);
  const [rarities, setRarities] = useState<Array<Rarity>>([
    { dropPercent: 7898, minSpins: 1 },
    { dropPercent: 2000, minSpins: 3 },
    { dropPercent: 100, minSpins: 10 },
    { dropPercent: 2, minSpins: 50 },
  ]);


  const [reload, setReload] = useState({});
  const { nfts } = useFetchNfts(reload);
  const [selectedNfts, setSelectedNfts] = useState<Array<number>>([]);
  const [tokens, setTokens] = useState(
    TOKENS.map(token => ({ ...token, balance: 0 } as TOKEN))
  );
  const [tokenAmounts, setTokenAmounts] = useState(Array(TOKENS.length).fill(0));
  const { lootbox } = useFetchLootbox(program, name, reload);

  const { nfts: lootboxNfts } = useFetchNfts(reload, lootbox);
  const [selectedLootboxNfts, setSelectedLootboxNfts] = useState<Array<number>>([]);

  const [nftPrizes, setNftPrizes] = useState<Array<Array<{ index: number, lootbox: boolean }>>>(new Array(4).fill([]));
  const [splPrizes, setSplPrizes] = useState<Array<Array<{ index: number, amount: number, lootbox: boolean }>>>(new Array(4).fill([]));
  const [currentSplRarity, setCurrentSplRarity] = useState(0);
  const [offChainPrizes, setOffChainPrizes] = useState<Array<OffChainItem>>([]);
  const [offChainItems, setOffChainItems] = useState<Array<{ index: number, name: string, image: string }>>([]);

  const fetchData = useCallback(async (tokens: Array<TOKEN>) => {
    try {
      if (lootbox && connection) {
        setFee(lootbox.fee.toNumber() / LAMPORTS_PER_SOL);
        setFeeWallet(lootbox.feeWallet.toString());
        setTicketMint(lootbox.ticketMint);
        let { decimals } = await getMint(connection, lootbox.ticketMint);
        decimals = Math.pow(10, decimals);
        setDecimals(decimals);
        setTicketPrice(lootbox.ticketPrice.toNumber() / decimals);
        setRarities(lootbox.rarities);

        let splMints = TOKENS.map(token => token.mint.toString());
        const newTokens = [...tokens.map(token => ({ ...token }))];
        lootbox.splVaults.filter(splVault => splMints.includes(splVault.mint.toString())).map(splVault => {
          let index = splMints.indexOf(splVault.mint.toString());
          if (index !== -1) {
            newTokens[index].balance = splVault.amount.toNumber() / TOKENS[index].decimals;
          }
          console.log(splVault.amount.toNumber());
        });
        setTokens(newTokens);

        const nftPrizes = new Array(4).fill([]);
        const splPrizes = new Array(4).fill([]);
        lootbox.prizeItems.forEach((prizeItem) => {
          const { rarity } = prizeItem;
          if (prizeItem.onChainItem) {
            const { splIndex, amount: prizeAmount } = prizeItem.onChainItem;
            const { mint, amount } = lootbox.splVaults[splIndex];
            if (amount.toNumber() === 1) {
              nftPrizes[rarity].push({ index: splIndex, lootbox: true });
            } else {
              splPrizes[rarity].push({ index: splIndex, lootbox: true, amount: prizeAmount });
            }
          }
        })
        setNftPrizes(nftPrizes);
        setSplPrizes(splPrizes);
      } else {

      }

    } catch (error) {
      console.log(error);
    }
  }, [lootbox, connection]);

  useEffect(() => {
    fetchData(tokens);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload, fetchData]);

  const handleCreateLootbox = async () => {
    if (!wallet.publicKey || !program) {
      return;
    }

    const txn = await createLootbox(
      program,
      wallet,
      name,
      new BN(fee * LAMPORTS_PER_SOL),
      new PublicKey(feeWallet),
      ticketMint,
      new BN(ticketPrice * decimals),
      rarities,
    );

    if (txn) {
      toast.success('Created lootbox successfully');
      setReload({});
    } else {
      toast.error('Failed to create lootbox');
    }
  }

  const handleUpdateLootbox = async () => {
    if (!wallet.publicKey || !program) {
      return;
    }

    const txn = await updateLootbox(
      program,
      wallet,
      name,
      new BN(fee * LAMPORTS_PER_SOL),
      new PublicKey(feeWallet),
      new BN(ticketPrice * decimals),
      rarities,
    );

    if (txn) {
      toast.success('Updated lootbox successfully');
      setReload({});
    } else {
      toast.error('Failed to update lootbox');
    }
  }

  const handleCreatePlayer = async () => {
    if (!wallet.publicKey || !program) {
      return;
    }

    const txn = await createPlayer(
      program,
      wallet,
    );

    if (txn) {
      toast.success('Created player account successfully');
      setReload({});
    } else {
      toast.error('Failed to create player account');
    }
  }

  const handleFundNfts = async () => {
    if (!wallet.publicKey || !program) {
      return;
    }

    const mints = selectedNfts.map(index => nfts[index].mint);
    const amounts = Array(selectedNfts.length).fill(new BN(1));
    const txn = await fund(
      program,
      name,
      wallet,
      mints,
      amounts,
    );
    console.log(txn)
    if (txn) {
      toast.success('Funded Nfts successfully');
      setReload({});
    } else {
      toast.error('Failed to fund Nfts');
    }
  }

  const handleFundSpl = async (token: TOKEN, index: number) => {
    if (!wallet.publicKey || !program) {
      return;
    }

    const { decimals, symbol, mint } = token;
    const amount = tokenAmounts[index];
    if (!amount) return;
    const txn = await fund(
      program,
      name,
      wallet,
      [mint],
      [new BN(amount * decimals)],
    );
    console.log(txn)
    if (txn) {
      toast.success(`Funded ${amount} ${symbol}  successfully`);
      setReload({});
    } else {
      toast.error('Failed to fund token');
    }
  }

  const handleDrainSpl = async (token: TOKEN, index: number) => {
    if (!wallet.publicKey || !program) {
      return;
    }

    const { decimals, symbol, mint } = token;
    const amount = tokenAmounts[index];
    const txn = await drain(
      program,
      name,
      wallet,
      [mint],
      [new BN(amount * decimals)],
    );
    console.log(txn)
    if (txn) {
      toast.success(`Drained ${amount} ${symbol}  successfully`);
      setReload({});
    } else {
      toast.error('Failed to drain token');
    }
  }

  const handleDrainNfts = async () => {
    if (!wallet.publicKey || !program) {
      return;
    }

    const mints = selectedLootboxNfts.map(index => lootboxNfts[index].mint);
    const amounts = Array(selectedLootboxNfts.length).fill(new BN(1));
    const txn = await drain(
      program,
      name,
      wallet,
      mints,
      amounts,
    );
    console.log(txn)
    if (txn) {
      toast.success('Drained Nfts successfully');
      setReload({});
    } else {
      toast.error('Failed to drain Nfts');
    }
  }

  const handleAddPrizes = async () => {
    if (!wallet.publicKey || !program) {
      return;
    }

    const mints: Array<PublicKey> = [];
    const amounts: Array<BN> = [];
    const rarities: Array<number> = [];
    for (let rarity = 0; rarity < 4; rarity++) {
      nftPrizes[rarity].forEach((item) => {
        if (!item.lootbox) {
          mints.push(lootboxNfts[item.index].mint);
          amounts.push(new BN(1));
          rarities.push(rarity);
        }
      })
      splPrizes[rarity].forEach(splItem => {
        if (!splItem.lootbox) {
          mints.push(tokens[splItem.index].mint);
          amounts.push(new BN(splItem.amount * tokens[splItem.index].decimals));
          rarities.push(rarity);
        }
      })
    }
    const txn = await addItems(
      program,
      name,
      wallet,
      mints,
      amounts,
      rarities,
      []
    )

    console.log(txn)
    if (txn) {
      toast.success('Drained Nfts successfully');
      setReload({});
    } else {
      toast.error('Failed to drain Nfts');
    }
  }

  const handleAddNftPrizes = (prizes: Array<number>, rarity: number) => {
    const newNftPrizes = nftPrizes.map((prizes) => [...prizes]);
    newNftPrizes[rarity] = prizes.map((index) => ({ index, lootbox: false }));
    setNftPrizes(newNftPrizes);
  }
  return (
    <div className='flex flex-col'>
      <div className='flex justify-center'>
        {!wallet.publicKey ? <WalletConnectButton /> : <WalletMultiButton />}
      </div>
      <button onClick={handleCreateLootbox}>Create Lootbox</button>
      <button onClick={handleUpdateLootbox}>Update Lootbox</button>
      <button onClick={handleCreatePlayer}>Create Player</button>
      <button onClick={handleFundNfts}>Fund NFTs</button>
      <button onClick={handleDrainNfts}>Drain NFTs</button>

      <div>
        <div className='flex gap-2 flex-row-reverse w-fit'>
          {['Common', 'Uncommon', 'Rare', 'Legend'].map((category, index) => (
            <button
              className={`border ${index === currentSplRarity ? 'border-black' : ''}`}
              key={'spl-button-' + category}
              onClick={() => setCurrentSplRarity(index)}
            >{category}</button>
          ))}
        </div>
      </div>
      <div className='flex flex-col gap-1'>
        {splPrizes[currentSplRarity].map((splItem: { index: number, amount: number }, index: number) => (
          <div key={`splItem-${index}`} className='flex gap-1 items-center'>
            <input
              className='border border-black'
              type='number'
              value={splItem.amount}
              onChange={(e) => {
                const newSplPrizes = splPrizes.map(prizes => prizes.map(prize => ({ ...prize })));
                newSplPrizes[currentSplRarity][index].amount = parseFloat(e.target.value) || 0.0;
                setSplPrizes(newSplPrizes);
              }}
            />
            <select
              className='border border-black'
              value={splItem.index}
              onChange={(e) => {
                const newSplPrizes = splPrizes.map(prizes => prizes.map(prize => ({ ...prize })));
                newSplPrizes[currentSplRarity][index].index = parseInt(e.target.value);
                setSplPrizes(newSplPrizes);
              }}
            >
              {tokens.map((token, tokenIndex) => (
                <option key={`${index}-${token.symbol}`} value={tokenIndex}>{token.symbol}</option>
              ))}
            </select>
            <button
              className='border border-black'
              onClick={() => {
                const newSplPrizes = splPrizes.map(prizes => prizes.map(prize => ({ ...prize })));
                newSplPrizes[currentSplRarity].splice(index, 1);
                setSplPrizes(newSplPrizes);
              }}>Remove</button>
          </div>
        ))}
        <button
          className='border border-black w-fit'
          onClick={() => {
            const newSplPrizes = splPrizes.map(prizes => prizes.map(prize => ({ ...prize })));
            newSplPrizes[currentSplRarity].push({ index: 0, amount: 0, lootbox: false });
            setSplPrizes(newSplPrizes);
          }}>Add</button>
      </div>


      <div className='flex flex-col'>
        {tokens.map((token, index) => (
          <div key={token.mint.toString()} className='flex gap-2'>
            <p>{token.symbol}: {token.balance}</p>
            <input
              className='border border-black'
              value={tokenAmounts[index]}
              onChange={(e) => {
                const amounts = [...tokenAmounts];
                amounts[index] = parseFloat(e.target.value) || 0;
                setTokenAmounts(amounts);
              }}
            />
            <button className='border' onClick={() => handleFundSpl(token, index)}>Fund</button>
            <button className='border' onClick={() => handleDrainSpl(token, index)}>Drain</button>
          </div>
        ))}
      </div>

      <div className='grid grid-cols-6 gap-5'>
        {
          nfts.map((nft, index) => (
            <div
              key={nft.mint.toString()}
              className="flex flex-col justify-between"
              onClick={() => {
                if (selectedNfts.includes(index)) {
                  setSelectedNfts(selectedNfts.filter((val) => val !== index));
                } else {
                  setSelectedNfts([...selectedNfts, index]);
                }
              }}
            >
              <div className='relative'>
                {selectedNfts.includes(index) && <div className='absolute top-2 right-2 rounded-full w-2 h-2 bg-[#9945FF] z-10'></div>}
                <LazyLoadImage
                  src={nft.image}
                  className='rounded-md w-full'
                  effect='blur'
                />
              </div>
              {/* <img src={nft.image} alt="" className='rounded-md w-full' /> */}
              {/* <p>{nft.name}</p> */}
              <p>{nft.floorPrice.toLocaleString('en-us', { maximumFractionDigits: 2 })}sol</p>
            </div>
          ))
        }
      </div>

      <div className='grid grid-cols-6 gap-5'>
        {
          lootboxNfts.map((nft, index) => (
            <div
              key={nft.mint.toString()}
              className="flex flex-col justify-between"
              onClick={() => {
                if (selectedLootboxNfts.includes(index)) {
                  setSelectedLootboxNfts(selectedLootboxNfts.filter((val) => val !== index));
                } else {
                  setSelectedLootboxNfts([...selectedLootboxNfts, index]);
                }
              }}
            >
              <div className='relative'>
                {selectedLootboxNfts.includes(index) && <div className='absolute top-2 right-2 rounded-full w-2 h-2 bg-[#9945FF] z-10'></div>}
                <LazyLoadImage
                  src={nft.image}
                  className='rounded-md w-full'
                  effect='blur'
                />
              </div>
              {/* <img src={nft.image} alt="" className='rounded-md w-full' /> */}
              {/* <p>{nft.name}</p> */}
              <p>{nft.floorPrice.toLocaleString('en-us', { maximumFractionDigits: 2 })}sol</p>
            </div>
          ))
        }
      </div>
    </div>
  );
};