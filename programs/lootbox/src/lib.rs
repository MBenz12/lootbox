mod ins;
mod state;
mod utils;

use ins::*;
use state::*;
use utils::*;

use anchor_lang::{prelude::*, system_program};
use anchor_spl::token::{transfer, Transfer};

declare_id!("F8CacAyTqgYCnuLVLy8CVB3LGN2nqschYsVETxAMc1sk");

#[program]
pub mod lootbox {
    use super::*;

    pub fn create_lootbox(
        ctx: Context<CreateLootbox>,
        name: String,
        fee: u64,
        fee_wallet: Pubkey,
        ticket_mint: Pubkey,
        ticket_price: u64,
        rarities: Vec<Rarity>,
    ) -> Result<()> {
        let lootbox = &mut ctx.accounts.lootbox;
        lootbox.bump = *ctx.bumps.get("lootbox").unwrap();
        lootbox.name = name;
        lootbox.authority = ctx.accounts.authority.key();
        lootbox.fee = fee;
        lootbox.fee_wallet = fee_wallet;
        lootbox.ticket_mint = ticket_mint;
        lootbox.ticket_price = ticket_price;
        lootbox.rarities = rarities;
        lootbox.spl_vaults = vec![];
        lootbox.prize_items = vec![];

        Ok(())
    }

    pub fn update_lootbox(
        ctx: Context<UpdateLootbox>,
        fee: u64,
        fee_wallet: Pubkey,
        ticket_price: u64,
        rarities: Vec<Rarity>,
    ) -> Result<()> {
        let lootbox = &mut ctx.accounts.lootbox;
        lootbox.fee = fee;
        lootbox.fee_wallet = fee_wallet;
        lootbox.ticket_price = ticket_price;
        lootbox.rarities = rarities;

        Ok(())
    }

    pub fn fund(ctx: Context<Fund>, amount: u64, is_nft: bool) -> Result<()> {
        let lootbox = &mut ctx.accounts.lootbox;
        let prize_mint = ctx.accounts.prize_mint.key();
        let index = lootbox.spl_vaults.iter().position(|x| x.mint == prize_mint);
        if let Some(index) = index {
            lootbox.spl_vaults[index].amount = lootbox.spl_vaults[index]
                .amount
                .checked_add(amount)
                .unwrap();
        } else {
            let new_spl_vault = SplVault {
                mint: prize_mint,
                amount,
                is_nft,
            };
            let mut added = false;
            for i in 0..lootbox.spl_vaults.len() {
                let SplVault {
                    mint,
                    is_nft: _,
                    amount: _,
                } = lootbox.spl_vaults[i];
                if mint == Pubkey::default() {
                    lootbox.spl_vaults[i] = new_spl_vault;
                    added = true;
                    break;
                }
            }

            if added == false {
                lootbox.spl_vaults.push(new_spl_vault);
            }
        }

        transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.funder_ata.to_account_info(),
                    to: ctx.accounts.lootbox_ata.to_account_info(),
                    authority: ctx.accounts.funder.to_account_info(),
                },
            ),
            amount,
        )?;

        Ok(())
    }

    pub fn drain(ctx: Context<Drain>, amount: u64) -> Result<()> {
        let lootbox = &ctx.accounts.lootbox;
        let bump = lootbox.bump;
        let name = &lootbox.name;
        let seeds = [b"lootbox".as_ref(), name.as_ref(), &[bump]];
        let signer = &[&seeds[..]];

        transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.lootbox_ata.to_account_info(),
                    to: ctx.accounts.drainer_ata.to_account_info(),
                    authority: ctx.accounts.lootbox.to_account_info(),
                },
                signer,
            ),
            amount,
        )?;

        let lootbox = &mut ctx.accounts.lootbox;
        let prize_mint = ctx.accounts.prize_mint.key();
        let index = lootbox
            .spl_vaults
            .iter()
            .position(|x| x.mint == prize_mint)
            .unwrap();

        if lootbox.spl_vaults[index].is_nft {
            lootbox.spl_vaults[index].mint = Pubkey::default();
        } else {
            lootbox.spl_vaults[index].amount = lootbox.spl_vaults[index]
                .amount
                .checked_sub(amount)
                .unwrap();
        }

        require!(
            lootbox
                .prize_items
                .iter()
                .any(|x| x.on_chain_item.is_some()
                    && x.on_chain_item.unwrap().spl_index == index as u8)
                == false,
            LootboxError::InvalidDrain
        );

        Ok(())
    }

    pub fn add_on_chain_item(
        ctx: Context<UpdateLootbox>,
        prize_mint: Pubkey,
        amount: u64,
        rarity: u8,
    ) -> Result<()> {
        let lootbox = &mut ctx.accounts.lootbox;
        let index = lootbox
            .spl_vaults
            .iter()
            .position(|x| x.mint == prize_mint)
            .unwrap();
        if lootbox.spl_vaults[index].amount >= amount {
            lootbox.prize_items.push(PrizeItem {
                on_chain_item: Some(OnChainItem {
                    spl_index: index as u8,
                    amount,
                }),
                off_chain_item: None,
                rarity,
            });
        }

        Ok(())
    }

    pub fn update_on_chain_item(ctx: Context<UpdateLootbox>, index: u8, amount: u64) -> Result<()> {
        let lootbox = &mut ctx.accounts.lootbox;
        if amount == 0 {
            lootbox.prize_items.remove(index as usize);
            update_drop_percents(lootbox);
        } else {
            let mut on_chain_item = lootbox.prize_items[index as usize].on_chain_item.unwrap();
            on_chain_item.amount = amount;
            lootbox.prize_items[index as usize].on_chain_item = Some(on_chain_item);
        }

        Ok(())
    }

    pub fn add_off_chain_item(
        ctx: Context<UpdateLootbox>,
        item_index: u8,
        total_items: u32,
        unlimited: bool,
        rarity: u8,
    ) -> Result<()> {
        let lootbox = &mut ctx.accounts.lootbox;
        let index = lootbox.prize_items.iter().position(|x| {
            x.off_chain_item.is_some() && x.off_chain_item.unwrap().item_index == item_index
        });

        if let Some(index) = index {
            if total_items == 0 {
                lootbox.prize_items.remove(index);
                update_drop_percents(lootbox);
            } else {
                let mut off_chain_item = lootbox.prize_items[index].off_chain_item.unwrap();
                off_chain_item.total_items = total_items;
                lootbox.prize_items[index].off_chain_item = Some(off_chain_item);
            }
        } else {
            lootbox.prize_items.push(PrizeItem {
                on_chain_item: None,
                off_chain_item: Some(OffChainItem {
                    item_index,
                    total_items,
                    used_items: 0,
                    unlimited,
                    claimed: false,
                }),
                rarity,
            });
        }

        Ok(())
    }

    pub fn create_player(ctx: Context<CreatePlayer>) -> Result<()> {
        let player = &mut ctx.accounts.player;
        player.bump = *ctx.bumps.get("player").unwrap();
        player.key = ctx.accounts.authority.key();
        player.lootboxes = vec![];

        Ok(())
    }

    #[access_control(valid_program(&ctx.accounts.instruction_sysvar_account, *ctx.program_id))]
    // #[access_control(prevent_suffix_instruction(&ctx.accounts.instruction_sysvar_account))]
    pub fn play(ctx: Context<Play>) -> Result<()> {
        let lootbox = &ctx.accounts.lootbox;
        let fee = lootbox.fee;

        system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                system_program::Transfer {
                    from: ctx.accounts.user.to_account_info(),
                    to: ctx.accounts.fee_wallet.to_account_info(),
                },
            ),
            fee,
        )?;

        let ticket_price = lootbox.ticket_price;
        transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.user_ata.to_account_info(),
                    to: ctx.accounts.lootbox_ata.to_account_info(),
                    authority: ctx.accounts.user.to_account_info(),
                },
            ),
            ticket_price,
        )?;

        let player = &mut ctx.accounts.player;
        let lootbox_key = ctx.accounts.lootbox.key();
        let index = player
            .lootboxes
            .iter()
            .position(|x| x.lootbox == lootbox_key);
        let lootbox_index = if let Some(index) = index {
            index
        } else {
            let player_box = PlayerBox {
                lootbox: lootbox_key,
                rarity_spins: vec![0; 4],
                on_chain_prizes: vec![],
                off_chain_prizes: vec![],
            };
            player.lootboxes.push(player_box);
            player.lootboxes.len() - 1
        };
        let mut index: usize = 0;
        let mut chance: u32 = 0;
        let rand = get_random(&ctx.accounts.recent_slothashes);
        let mut win_rarity_index: usize = 0;

        for i in 0..4 {
            player.lootboxes[lootbox_index].rarity_spins[i] = player.lootboxes[lootbox_index]
                .rarity_spins[i]
                .checked_add(1)
                .unwrap();
        }

        for rarity in &lootbox.rarities {
            chance = chance.checked_add(rarity.drop_percent).unwrap();
            if rand <= chance
                && player.lootboxes[lootbox_index].rarity_spins[index] >= rarity.min_spins
            {
                win_rarity_index = index;
                player.lootboxes[lootbox_index].rarity_spins[index] = 0;
                break;
            }
            index = index.checked_add(1).unwrap();
        }

        let is_winnable =
            |x: &PrizeItem| {
                if x.rarity == win_rarity_index as u8 {
                    if x.on_chain_item.is_some() {
                        return true;
                    }
                    if let Some(off_chain_item) = x.off_chain_item {
                        if off_chain_item.total_items > off_chain_item.used_items {
                            if off_chain_item.unlimited {
                                return true;
                            }
                            return player.lootboxes[lootbox_index].off_chain_prizes.iter().any(
                                |y| y.item_index == off_chain_item.item_index && y.claimed == false,
                            );
                        }
                    }
                }
                return false;
            };

        let len = lootbox
            .prize_items
            .iter()
            .filter(|&x| is_winnable(x))
            .count();
        require!(len > 0, LootboxError::NoPrize);

        let mut rand_index = rand.checked_rem(len as u32).unwrap();
        let mut prize_index: usize = 0;
        for i in 0..lootbox.prize_items.len() {
            let x = lootbox.prize_items[i];
            if is_winnable(&x) {
                if rand_index == 0 {
                    prize_index = i;
                    break;
                }
                rand_index = rand_index.checked_sub(1).unwrap();
            }
        }

        let lootbox = &mut ctx.accounts.lootbox;

        update_drop_percents(lootbox);

        let prize_item = lootbox.prize_items[prize_index];
        if let Some(on_chain_item) = prize_item.on_chain_item {
            let spl_index = on_chain_item.spl_index as usize;
            if lootbox.spl_vaults[spl_index].amount < on_chain_item.amount * 2 {
                lootbox.prize_items.remove(prize_index);
            }
            let index = player.lootboxes[lootbox_index]
                .on_chain_prizes
                .iter()
                .position(|x| x.spl_index == spl_index as u8);
            if let Some(index) = index {
                player.lootboxes[lootbox_index].on_chain_prizes[index].amount =
                    player.lootboxes[lootbox_index].on_chain_prizes[index]
                        .amount
                        .checked_add(on_chain_item.amount)
                        .unwrap();
            } else {
                player.lootboxes[lootbox_index]
                    .on_chain_prizes
                    .push(on_chain_item);
            }
            lootbox.spl_vaults[spl_index].amount = lootbox.spl_vaults[spl_index]
                .amount
                .checked_sub(on_chain_item.amount)
                .unwrap();
        }
        if let Some(mut off_chain_item) = prize_item.off_chain_item {
            player.lootboxes[lootbox_index]
                .off_chain_prizes
                .push(off_chain_item);
            off_chain_item.used_items = off_chain_item.used_items.checked_add(1).unwrap();
            lootbox.prize_items[prize_index].off_chain_item = Some(off_chain_item);
        }

        emit!(PlayEvent {
            player: ctx.accounts.user.key(),
            lootbox: lootbox_key,
            prize_item,
            timestamp: now(),
        });

        Ok(())
    }

    // #[access_control(valid_program(&ctx.accounts.instruction_sysvar_account, *ctx.program_id))]
    pub fn claim(ctx: Context<Claim>) -> Result<()> {
        let lootbox = &ctx.accounts.lootbox;
        let player = &mut ctx.accounts.player;
        let lootbox_key = ctx.accounts.lootbox.key();
        let lootbox_index = player
            .lootboxes
            .iter()
            .position(|x| x.lootbox == lootbox_key)
            .unwrap();

        let prize_mint = ctx.accounts.prize_mint.key();
        let spl_index = lootbox
            .spl_vaults
            .iter()
            .position(|x| x.mint == prize_mint)
            .unwrap();

        let prize_index = player.lootboxes[lootbox_index]
            .on_chain_prizes
            .iter()
            .position(|x| x.spl_index == spl_index as u8)
            .unwrap();
        let prize_item = player.lootboxes[lootbox_index]
            .on_chain_prizes
            .remove(prize_index);

        let bump = lootbox.bump;
        let name = &lootbox.name;
        let seeds = [b"lootbox".as_ref(), name.as_ref(), &[bump]];
        let signer = &[&seeds[..]];

        transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.lootbox_ata.to_account_info(),
                    to: ctx.accounts.claimer_ata.to_account_info(),
                    authority: ctx.accounts.lootbox.to_account_info(),
                },
                signer,
            ),
            prize_item.amount,
        )?;

        let lootbox = &mut ctx.accounts.lootbox;
        let spl_index = prize_item.spl_index as usize;
        let SplVault {
            mint: _,
            amount: _,
            is_nft,
        } = lootbox.spl_vaults[spl_index];
        if is_nft {
            lootbox.spl_vaults[spl_index].mint = Pubkey::default();
        }

        Ok(())
    }

    pub fn set_claimed(ctx: Context<SetClaimed>, prize_index: u8) -> Result<()> {
        let player = &mut ctx.accounts.player;
        let lootbox_key = ctx.accounts.lootbox.key();
        let lootbox_index = player
            .lootboxes
            .iter()
            .position(|x| x.lootbox == lootbox_key)
            .unwrap();

        let index = prize_index as usize;
        let off_chain_item = player.lootboxes[lootbox_index].off_chain_prizes[index];

        if off_chain_item.unlimited {
            player.lootboxes[lootbox_index]
                .off_chain_prizes
                .remove(index);
        } else {
            player.lootboxes[lootbox_index].off_chain_prizes[index].claimed = true;
        }

        Ok(())
    }

    pub fn close_pda(ctx: Context<ClosePda>) -> Result<()> {
        let dest_account_info = ctx.accounts.signer.to_account_info();
        let source_account_info = ctx.accounts.pda.to_account_info();
        let dest_starting_lamports = dest_account_info.lamports();
        **dest_account_info.lamports.borrow_mut() = dest_starting_lamports
            .checked_add(source_account_info.lamports())
            .unwrap();
        **source_account_info.lamports.borrow_mut() = 0;

        Ok(())
    }
}
