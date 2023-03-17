use anchor_lang::prelude::*;
use crate::state::*;

#[derive(Accounts)]
#[instruction(name: String)]
pub struct CreateGame<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        space =  Game::LEN + 8,
        seeds = [
            b"game".as_ref(),
            name.as_ref(),
        ],
        bump,        
        payer = authority,

    )]
    pub game: Account<'info, Game>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateGame<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        mut,
        seeds = [
            b"game".as_ref(),
            game.name.as_ref(),
        ],
        bump = game.bump
    )]
    pub game: Account<'info, Game>,
}

#[derive(Accounts)]
pub struct AddLootbox<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        mut,
        seeds = [
            b"game".as_ref(),
            game.name.as_ref(),
        ],
        bump = game.bump
    )]
    pub game: Account<'info, Game>,
}