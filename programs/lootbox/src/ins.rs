use anchor_lang::{prelude::*, solana_program::sysvar};
use anchor_spl::{token::{Mint, TokenAccount, Token}, associated_token::AssociatedToken};

use crate::state::*;

#[derive(Accounts)]
#[instruction(name: String)]
pub struct CreateLootbox<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        space =  16000,
        seeds = [
            b"lootbox".as_ref(),
            name.as_ref(),
        ],
        bump,        
        payer = authority,
    )]
    pub lootbox: Box<Account<'info, Lootbox>>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateLootbox<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        mut,
        seeds = [
            b"lootbox".as_ref(),
            lootbox.name.as_ref(),
        ],
        bump = lootbox.bump
    )]
    pub lootbox: Box<Account<'info, Lootbox>>,
}

#[derive(Accounts)]
pub struct Fund<'info> {
    #[account(mut)]
    pub funder: Signer<'info>,

    #[account(
        mut,
        seeds = [
            b"lootbox".as_ref(),
            lootbox.name.as_ref(),
        ],
        bump = lootbox.bump
    )]
    pub lootbox: Box<Account<'info, Lootbox>>,

    pub prize_mint: Box<Account<'info, Mint>>,

    #[account(
        mut,
        associated_token::mint = prize_mint,
        associated_token::authority = funder,
    )]
    pub funder_ata: Box<Account<'info, TokenAccount>>,

    #[account(
        associated_token::mint = prize_mint,
        associated_token::authority = lootbox,
    )]
    pub lootbox_ata: Box<Account<'info, TokenAccount>>,

    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct Drain<'info> {
    #[account(mut, address = lootbox.authority)]
    pub drainer: Signer<'info>,

    #[account(
        mut,
        seeds = [
            b"lootbox".as_ref(),
            lootbox.name.as_ref(),
        ],
        bump = lootbox.bump
    )]
    pub lootbox: Box<Account<'info, Lootbox>>,

    pub prize_mint: Box<Account<'info, Mint>>,

    #[account(
        mut,
        associated_token::mint = prize_mint,
        associated_token::authority = lootbox,
    )]
    pub lootbox_ata: Box<Account<'info, TokenAccount>>,

    #[account(
        mut,
        associated_token::mint = prize_mint,
        associated_token::authority = drainer,
    )]
    pub drainer_ata: Box<Account<'info, TokenAccount>>,

    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct CreatePlayer<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        payer = authority,
        seeds = [
            "player".as_ref(),
            authority.key().as_ref(),
        ],
        bump,
        space = PlayerBox::LEN + 8,
    )]
    pub player: Box<Account<'info, Player>>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Play<'info> {
    #[account(mut, address = player.key)]
    pub user: Signer<'info>,

    #[account(mut, address = lootbox.fee_wallet)]
    pub fee_wallet: SystemAccount<'info>,

    #[account(
        mut,
        seeds = [
            b"lootbox".as_ref(),
            lootbox.name.as_ref(),
        ],
        bump = lootbox.bump
    )]
    pub lootbox: Box<Account<'info, Lootbox>>,

    #[account(
        mut,
        seeds = [
            b"player".as_ref(),
            user.key().as_ref(),
        ],
        bump = player.bump,
    )]
    pub player: Box<Account<'info, Player>>,

    #[account(
        mut,
        associated_token::mint = lootbox.ticket_mint,
        associated_token::authority = user,
    )]
    pub user_ata: Box<Account<'info, TokenAccount>>,

    #[account(
        mut,
        associated_token::mint = lootbox.ticket_mint,
        associated_token::authority = lootbox,
    )]
    pub lootbox_ata: Box<Account<'info, TokenAccount>>,

    /// CHECK:
    #[account(address = sysvar::instructions::ID)]
    pub instruction_sysvar_account: AccountInfo<'info>,
  
    /// CHECK:
    #[account(address = sysvar::slot_hashes::ID)]
    pub recent_slothashes: AccountInfo<'info>,

    pub token_program: Program<'info, Token>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Claim<'info> {
    #[account(mut, address = player.key)]
    pub claimer: Signer<'info>,

    #[account(
        mut,
        seeds = [
            b"lootbox".as_ref(),
            lootbox.name.as_ref(),
        ],
        bump = lootbox.bump
    )]
    pub lootbox: Box<Account<'info, Lootbox>>,

    #[account(
        mut,
        seeds = [
            b"player".as_ref(),
            claimer.key().as_ref(),
        ],
        bump = player.bump,
    )]
    pub player: Box<Account<'info, Player>>,

    pub prize_mint: Box<Account<'info, Mint>>,

    #[account(
        mut,
        associated_token::mint = prize_mint,
        associated_token::authority = lootbox,
    )]
    pub lootbox_ata: Box<Account<'info, TokenAccount>>,
    
    #[account(
        associated_token::mint = prize_mint,
        associated_token::authority = claimer,
    )]
    pub claimer_ata: Box<Account<'info, TokenAccount>>,

    /// CHECK:
    #[account(address = sysvar::instructions::ID)]
    pub instruction_sysvar_account: AccountInfo<'info>,

    pub token_program: Program<'info, Token>,

    pub associated_token_program: Program<'info, AssociatedToken>,

    pub system_program: Program<'info, System>,

    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct SetClaimed<'info> {
    #[account(mut, address = lootbox.authority)]
    pub authority: Signer<'info>,

    pub user: SystemAccount<'info>,

    #[account(
        mut,
        seeds = [
            b"lootbox".as_ref(),
            lootbox.name.as_ref(),
        ],
        bump = lootbox.bump
    )]
    pub lootbox: Box<Account<'info, Lootbox>>,

    #[account(
        mut,
        seeds = [
            b"player".as_ref(),
            user.key().as_ref(),
        ],
        bump = player.bump,
    )]
    pub player: Box<Account<'info, Player>>,
}

#[derive(Accounts)]
pub struct ConfirmClaimed<'info> {
    #[account(mut, address = player.key)]
    pub user: Signer<'info>,

    #[account(
        mut,
        seeds = [
            b"lootbox".as_ref(),
            lootbox.name.as_ref(),
        ],
        bump = lootbox.bump
    )]
    pub lootbox: Box<Account<'info, Lootbox>>,

    #[account(
        mut,
        seeds = [
            b"player".as_ref(),
            user.key().as_ref(),
        ],
        bump = player.bump,
    )]
    pub player: Box<Account<'info, Player>>,
}