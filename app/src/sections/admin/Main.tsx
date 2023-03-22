import MainForm from "./forms/MainForm";
import SPLForm from "./forms/SPLForm";
import OffChainForm from "./forms/OffChainForm";
import NftsSection from "./NftsSection";
import Input from "../../components/admin/Input";
import Button from "../../components/admin/Button";
import NftCard from "../../components/admin/NftCard";
import SelectNftsDialog from "../../components/admin/SelectNftsDialog";


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
import { TOKENS } from '@/config';
import useFetchLootbox from '@/hooks/useFetchLootbox';
import { NftData, NftPrize, SplPrize, TOKEN } from '@/types';
import { getUnselectedPrizes } from '@/utils';

interface MainProps {
  name: string;
  setName: (name: string) => void;
  reload: {};
  setReload: (reload: {}) => void;
}

const rarityCategories = ["Common", "Uncommon", "Rare", "Legendary"];

const Main: React.FC<MainProps> = ({ name, setName, reload, setReload }) => {
  const [fundDialogOpen, setFundDialogOpen] = useState(false);
  const [drainDialogOpen, setDrainDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [currentNftRarity, setCurrentNftRarity] = useState(3);
  const [selectedPrizes, setSelectedPrizes] = useState<Array<number>>([]);

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

  const [tokens, setTokens] = useState(
    TOKENS.map(token => ({ ...token, balance: 0 } as TOKEN))
  );
  const [newToken, setNewToken] = useState('');

  const [fee, setFee] = useState(0);
  const [feeWallet, setFeeWallet] = useState("3qWq2ehELrVJrTg2JKKERm67cN6vYjm1EyhCEzfQ6jMd");
  const [ticketToken, setTicketToken] = useState<TOKEN>(tokens[0]);
  const [ticketPrice, setTicketPrice] = useState(0);
  const [decimals, setDecimals] = useState(1);
  const [rarities, setRarities] = useState<Array<Rarity>>([
    { dropPercent: 7898, minSpins: 1 },
    { dropPercent: 2000, minSpins: 3 },
    { dropPercent: 100, minSpins: 10 },
    { dropPercent: 2, minSpins: 50 },
  ]);
  const { nfts } = useFetchNfts(reload);
  const [selectedNfts, setSelectedNfts] = useState<Array<number>>([]);

  const [tokenAmounts, setTokenAmounts] = useState(Array(TOKENS.length).fill(0));
  const { lootbox } = useFetchLootbox(program, name, reload);

  const { nfts: lootboxNfts } = useFetchNfts(reload, lootbox);
  const [selectedLootboxNfts, setSelectedLootboxNfts] = useState<Array<number>>([]);

  const [nftPrizes, setNftPrizes] = useState<Array<Array<NftPrize>>>(new Array(4).fill([]));
  const [splPrizes, setSplPrizes] = useState<Array<Array<SplPrize>>>(new Array(4).fill([]));
  const [currentSplRarity, setCurrentSplRarity] = useState(3);
  // const [offChainPrizes, setOffChainPrizes] = useState<Array<OffChainItem>>([]);
  // const [offChainItems, setOffChainItems] = useState<Array<OffChainPrize>>([]);

  const fetchData = useCallback(async (tokens: Array<TOKEN>) => {
    console.log(lootboxNfts);
    try {
      if (lootbox && connection) {
        setFee(lootbox.fee.toNumber() / LAMPORTS_PER_SOL);
        setFeeWallet(lootbox.feeWallet.toString());
        let index = tokens.map(token => token.mint.toString()).indexOf(lootbox.ticketMint.toString());
        setTicketToken(tokens[index]);
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
              let index = lootboxNfts.map(nft => nft.mint.toString()).indexOf(mint.toString());
              nftPrizes[rarity].push({ index, lootbox: true });
            } else {
              let tokenMints = TOKENS.map(token => token.mint.toString());
              let tokenIndex = tokenMints.indexOf(mint.toString());
              splPrizes[rarity].push({ index: tokenIndex, lootbox: true, amount: prizeAmount });
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
  }, [lootbox, connection, lootboxNfts]);

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
      ticketToken.mint,
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

  const handleAddNftPrizes = (unSelectedPrizes: Array<NftData>, prizes: Array<number>, rarity: number) => {
    const newNftPrizes = nftPrizes.map((prizes) => [...prizes]);
    newNftPrizes[rarity] = prizes.map((prizeIndex) => { 
      let prize = unSelectedPrizes[prizeIndex];
      let index = lootboxNfts.map(nft => nft.mint.toString()).indexOf(prize.mint.toString());
      return { index, lootbox: false };
    });
    setNftPrizes(newNftPrizes);
    setAddDialogOpen(false);
    setSelectedPrizes([]);
  }

  return (
    <div className={"flex flex-wrap justify-center w-full gap-5"}>
      {fundDialogOpen &&
        <SelectNftsDialog
          setOpen={() => setFundDialogOpen(false)}
          nfts={nfts}
          selectedNfts={selectedNfts}
          setSelectedNfts={setSelectedNfts}
          label="Fund NFTs"
          buttonName="Fund"
          handleClick={handleFundNfts}
        />
      }
      {drainDialogOpen &&
        <SelectNftsDialog
          setOpen={() => setDrainDialogOpen(false)}
          nfts={lootboxNfts}
          selectedNfts={selectedLootboxNfts}
          setSelectedNfts={setSelectedLootboxNfts}
          label="Drain NFTs"
          buttonName="Drain"
          handleClick={handleDrainNfts}
        />
      }
      <MainForm
        name={name}
        lootbox={lootbox}
        fee={fee}
        feeWallet={feeWallet}
        ticketPrice={ticketPrice}
        ticketToken={ticketToken}
        tokens={tokens}
        setName={setName}
        setFee={setFee}
        setFeeWallet={setFeeWallet}
        setTicketPrice={setTicketPrice}
        setTicketToken={setTicketToken}
        handleClickCreate={!lootbox ? handleCreateLootbox : handleUpdateLootbox}
      />

      <SPLForm
        tokens={tokens}
        newToken={newToken}
        splPrizes={splPrizes}
        currentSplRarity={currentSplRarity}
        tokenAmounts={tokenAmounts}
        setNewToken={setNewToken}
        setTokenAmounts={setTokenAmounts}
        setSplPrizes={setSplPrizes}
        setCurrentSplRarity={setCurrentSplRarity}
        handleFundSpl={handleFundSpl}
        handleDrainSpl={handleDrainSpl}
      />

      <OffChainForm rarities={rarityCategories} />

      <div className={"w-full flex justify-center my-5 gap-4"}>
        <Button onClick={() => setFundDialogOpen(true)} text={"Fund NFTs"} />
        <Button onClick={() => setDrainDialogOpen(true)} text={"Drain NFTs"} />
        <Button onClick={() => handleAddPrizes()} text={"Add Prizes"} />
      </div>

      {
        rarities.map((rarity: Rarity, index) => {
          return (
            <div key={rarityCategories[index]} className={"mx-24 w-full mt-10"}>
              {(addDialogOpen && currentNftRarity === index) &&
                <SelectNftsDialog
                  setOpen={() => setAddDialogOpen(false)}
                  nfts={getUnselectedPrizes(lootbox, lootboxNfts, nftPrizes)}
                  selectedNfts={selectedPrizes}
                  setSelectedNfts={setSelectedPrizes}
                  label={`Add NFTs as ${rarityCategories[index]}`}
                  buttonName="Add"
                  handleClick={() => handleAddNftPrizes(getUnselectedPrizes(lootbox, lootboxNfts, nftPrizes), selectedPrizes, index)}
                />
              }
              <div className={"flex place-items-center gap-4 mb-5"}>
                <p className={"text-[32px] w-[200px]"}>{rarityCategories[index]}</p>
                <div className={"flex gap-5"}>
                  <Input
                    size={"sm"}
                    type={"number"}
                    name={`${rarityCategories[index]}.dropPercentage`}
                    onChange={(e) => {
                      const newRarities = rarities.map(rarity => ({ ...rarity }));
                      newRarities[index].dropPercent = (parseFloat(e.target.value) || 0.0) * 100;
                      setRarities(newRarities);
                    }}
                    label={"Drop %"}
                    value={rarity.dropPercent / 100}
                  />
                  <Input
                    size={"sm"}
                    type={"number"}
                    name={`${rarityCategories[index]}.minSOLValue`}
                    onChange={() => { }}
                    label={"Min. SOL Value"}
                    value={0}
                  />
                  <Input
                    size={"sm"}
                    type={"number"}
                    name={`${rarityCategories[index]}.minSpins`}
                    onChange={(e) => {
                      const newRarities = rarities.map(rarity => ({ ...rarity }));
                      newRarities[index].minSpins = parseInt(e.target.value) || 0.0;
                      setRarities(newRarities);
                    }}
                    label={"Min. Spins"}
                    value={rarity.minSpins}
                  />
                </div>
                <div className={"ml-auto"}>
                  <Button text={"Add NFTs"} onClick={() => {
                    setCurrentNftRarity(index);
                    setAddDialogOpen(true);
                  }} />
                </div>
              </div>
              <NftsSection>
                {
                  nftPrizes[index].map((nftItem: NftPrize, index: number) => {
                    return <NftCard image={lootboxNfts[nftItem.index]?.image} price={lootboxNfts[nftItem.index].floorPrice} key={"nft-" + index} />
                  })
                }
                {
                  splPrizes[index].map((splItem: SplPrize, index: number) => {
                    return <NftCard price={splItem.amount} key={"spl-" + index} symbol={tokens[splItem.index].symbol} />
                  })
                }
              </NftsSection>
            </div>
          )
        }).reverse()
      }

    </div>
  );
};

export default Main;