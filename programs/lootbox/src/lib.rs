mod state;
mod ins;

use anchor_lang::prelude::*;

declare_id!("F8CacAyTqgYCnuLVLy8CVB3LGN2nqschYsVETxAMc1sk");

#[program]
pub mod lootbox {
    use super::*;

    pub fn initialize(_ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
