use anchor_lang::prelude::*;

#[account]
pub struct Game {
    pub name: String,
    pub authority: Pubkey,
    pub lootboxes: Vec<Lootbox>,
    pub prize_items: Vec<PrizeItem>,
    pub chance_per_rarity: [u16; 4],
    pub min_spins_per_rarity: [u8; 4],
    pub fee: u64,
    pub fee_wallet: Pubkey,
    pub ticket_price: u64,
    pub bump: u8,
}

pub struct Lootbox {
    pub rarity: u8,
    pub prize_mint: Pubkey,
    pub token_amount: u64,
    pub prize_item: u8,
    pub item_amount: u8,
}

pub struct PrizeItem {
    pub name: String,
    pub image: String,
    pub amount: u8,
}

#[account]
pub struct Player {
    pub name: String,
    pub key: Pubkey,
    pub lost_count: u8,
    pub earned_items: Vec<u8>,
    pub bump: u8,
}

impl Lootbox {
    pub const LEN: usize = std::mem::size_of::<Lootbox>();
}

impl PrizeItem {
    pub const LEN: usize = std::mem::size_of::<PrizeItem>();
}

impl Game {
    pub const LEN: usize = 8 + std::mem::size_of::<Game>() + Lootbox::LEN * 20 + PrizeItem::LEN * 20;
}

impl Player {
    pub const LEN: usize = 8 + std::mem::size_of::<Player>() + 20;
}