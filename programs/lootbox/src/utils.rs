use anchor_lang::{
    prelude::*,
    solana_program::clock,
    solana_program::{
        serialize_utils::read_u16,
        sysvar::instructions::{
            // get_instruction_relative,
            load_current_index_checked,
            load_instruction_at_checked,
        },
    },
};
use arrayref::array_ref;

use crate::state::*;

pub fn now() -> u64 {
    clock::Clock::get().unwrap().unix_timestamp as u64
}

pub fn get_random(recent_slothashes: &AccountInfo) -> u32 {
    let data = recent_slothashes.data.borrow();
    let most_recent = array_ref![data, 12, 8];
    let timestamp = now();
    let seed = u64::from_le_bytes(*most_recent).saturating_sub(timestamp);
    let remainder: u32 = seed.checked_rem(10000).unwrap() as u32;

    remainder
}

pub fn valid_program(instruction_sysvar_account: &AccountInfo, program_id: Pubkey) -> Result<()> {
    let data = instruction_sysvar_account.try_borrow_data()?;
    let current_index =
        load_current_index_checked(instruction_sysvar_account.to_account_info().as_ref())?;
    msg!("Current index {}", current_index);
    let mut current = 0;
    let num_instructions;
    match read_u16(&mut current, &**data) {
        Ok(index) => {
            num_instructions = index;
        }
        Err(_) => {
            return Err(LootboxError::InvalidProgramId.into());
        }
    }
    let valid_program_ids = &[
        program_id,
        Pubkey::default(),
        "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
            .parse::<Pubkey>()
            .unwrap(),
        "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
            .parse::<Pubkey>()
            .unwrap(),
        "ComputeBudget111111111111111111111111111111"
            .parse::<Pubkey>()
            .unwrap(),
    ];
    for index in 0..num_instructions {
        let instruction = load_instruction_at_checked(index as usize, &instruction_sysvar_account)?;
        require!(
            valid_program_ids
                .iter()
                .any(|x| x == &instruction.program_id)
                == true,
            LootboxError::InvalidProgramId
        );
    }
    Ok(())
}

// pub fn prevent_prefix_instruction(instruction_sysvar_account: &AccountInfo) -> Result<()> {
//     let invalid = match get_instruction_relative(-1, &instruction_sysvar_account) {
//         Ok(_) => true,
//         Err(_) => false,
//     };
//     require!(invalid == false, LootboxError::InvalidInstructionAdded);

//     Ok(())
// }

// pub fn prevent_suffix_instruction(instruction_sysvar_account: &AccountInfo) -> Result<()> {
//     let invalid = match get_instruction_relative(1, &instruction_sysvar_account) {
//         Ok(_) => true,
//         Err(_) => false,
//     };
//     require!(invalid == false, LootboxError::InvalidInstructionAdded);

//     Ok(())
// }

pub fn update_drop_percents(lootbox: &mut Box<Account<Lootbox>>) {
    for rarity in 1..4 {
        let index = rarity as usize;
        if lootbox.rarities[index].drop_percent > 0 {
            if lootbox.prize_items.iter().any(|x| {
                if x.rarity == rarity as u8 {
                    if x.on_chain_item.is_some() {
                        return true;
                    }
                    if let Some(off_chain_item) = x.off_chain_item {
                        if off_chain_item.total_items > off_chain_item.used_items {
                            if off_chain_item.unlimited {
                                return true;
                            }
                        }
                    }
                }
                return false;
            }) == false
            {
                let drop_percent = lootbox.rarities[index].drop_percent;
                lootbox.rarities[index].drop_percent = 0;
                lootbox.rarities[0].drop_percent += drop_percent;
            }
        }
    }
}
