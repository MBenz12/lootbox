use anchor_lang::prelude::*;

#[account]
pub struct Lootbox {
    pub name: String,
    pub authority: Pubkey,
    pub fee: u64,
    pub fee_wallet: Pubkey,
    pub ticket_mint: Pubkey,
    pub ticket_price: u64,
    pub rarities: Vec<Rarity>,
    pub spl_vaults: Vec<SplVault>,
    pub prize_items: Vec<PrizeItem>,
    pub bump: u8,
}

#[derive(Debug, AnchorSerialize, AnchorDeserialize, Copy, Clone, PartialEq, Eq)]
pub struct SplVault {
    pub mint: Pubkey,
    pub amount: u64,
}

impl SplVault {
    pub const LEN: usize = std::mem::size_of::<SplVault>();
}

#[derive(Debug, AnchorSerialize, AnchorDeserialize, Copy, Clone, PartialEq, Eq)]
pub struct PrizeItem {
    pub on_chain_item: Option<OnChainItem>,
    pub off_chain_item: Option<OffChainItem>,
    pub rarity: u8,
}

#[derive(Debug, AnchorSerialize, AnchorDeserialize, Copy, Clone, PartialEq, Eq)]
pub struct OnChainItem {
    pub spl_index: u8,
    pub amount: u64,
}

#[derive(Debug, AnchorSerialize, AnchorDeserialize, Copy, Clone, PartialEq, Eq)]
pub struct OffChainItem {
    pub item_index: u8,
    pub total_items: u32,
    pub used_items: u32,
    pub claimed: bool,
}

#[derive(Debug, AnchorSerialize, AnchorDeserialize, Copy, Clone, PartialEq, Eq)]
pub struct Rarity {
    pub drop_percent: u32,
    pub min_spins: u16,
}

#[account]
pub struct Player {
    pub key: Pubkey,
    pub lootboxes: Vec<PlayerBox>,
    pub bump: u8,
}

#[derive(Debug, AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub struct PlayerBox {
    pub lootbox: Pubkey,
    pub rarity_spins: Vec<u16>,
    pub on_chain_prizes: Vec<OnChainItem>,
    pub off_chain_prizes: Vec<OffChainItem>,
}

impl PlayerBox {
    pub const LEN: usize = std::mem::size_of::<PlayerBox>() + 4 * 2 + 100 * SplVault::LEN + 100;
}

#[event]
pub struct PlayEvent {
    pub player: Pubkey,
    pub lootbox: Pubkey,
    pub prize_item: PrizeItem,
    pub timestamp: u64,
}

#[error_code]
pub enum LootboxError {
    #[msg("Invalid Instruction Added")]
    InvalidInstructionAdded,
    #[msg("Invalid Program")]
    InvalidProgramId,
    #[msg("No Prize")]
    NoPrize,
}