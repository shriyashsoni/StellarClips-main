#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, token, Address, Env, Symbol};

#[contracttype]
#[derive(Clone)]
pub struct CreatorBalance {
    pub creator: Address,
    pub available_balance: i128,
    pub total_earned: i128,
    pub total_withdrawn: i128,
    pub last_withdrawal: u64,
}

#[contracttype]
pub enum DataKey {
    Balance(Address),
    TokenAddress,
    MinWithdrawal,
}

const DEFAULT_MIN_WITHDRAWAL: i128 = 1_000_000; // 1 XLM (7 decimals)

#[contract]
pub struct RevenueContract;

#[contractimpl]
impl RevenueContract {
    /// Initialize contract
    pub fn initialize(env: Env, token_address: Address) {
        let token_key = DataKey::TokenAddress;
        env.storage().instance().set(&token_key, &token_address);
        
        let min_key = DataKey::MinWithdrawal;
        env.storage().instance().set(&min_key, &DEFAULT_MIN_WITHDRAWAL);
    }

    /// Record earnings for a creator
    pub fn record_earning(env: Env, creator: Address, amount: i128) {
        let balance_key = DataKey::Balance(creator.clone());
        
        let mut balance: CreatorBalance = env
            .storage()
            .persistent()
            .get(&balance_key)
            .unwrap_or(CreatorBalance {
                creator: creator.clone(),
                available_balance: 0,
                total_earned: 0,
                total_withdrawn: 0,
                last_withdrawal: 0,
            });

        balance.available_balance += amount;
        balance.total_earned += amount;

        env.storage().persistent().set(&balance_key, &balance);

        env.events().publish(
            (Symbol::new(&env, "earning_recorded"),),
            (creator, amount),
        );
    }

    /// Withdraw earnings
    pub fn withdraw(env: Env, creator: Address, amount: i128) {
        creator.require_auth();

        let balance_key = DataKey::Balance(creator.clone());
        let mut balance: CreatorBalance = env
            .storage()
            .persistent()
            .get(&balance_key)
            .expect("No balance found");

        // Check minimum withdrawal
        let min_withdrawal: i128 = env
            .storage()
            .instance()
            .get(&DataKey::MinWithdrawal)
            .unwrap_or(DEFAULT_MIN_WITHDRAWAL);

        assert!(amount >= min_withdrawal, "Amount below minimum withdrawal");
        assert!(balance.available_balance >= amount, "Insufficient balance");

        // Update balance
        balance.available_balance -= amount;
        balance.total_withdrawn += amount;
        balance.last_withdrawal = env.ledger().timestamp();

        env.storage().persistent().set(&balance_key, &balance);

        // Transfer tokens
        let token_address: Address = env
            .storage()
            .instance()
            .get(&DataKey::TokenAddress)
            .expect("Token address not set");

        let token_client = token::Client::new(&env, &token_address);
        token_client.transfer(&env.current_contract_address(), &creator, &amount);

        env.events().publish(
            (Symbol::new(&env, "withdrawal_processed"),),
            (creator, amount),
        );
    }

    /// Get creator balance
    pub fn get_balance(env: Env, creator: Address) -> CreatorBalance {
        let balance_key = DataKey::Balance(creator.clone());
        env.storage()
            .persistent()
            .get(&balance_key)
            .unwrap_or(CreatorBalance {
                creator,
                available_balance: 0,
                total_earned: 0,
                total_withdrawn: 0,
                last_withdrawal: 0,
            })
    }

    /// Get available balance only
    pub fn get_available_balance(env: Env, creator: Address) -> i128 {
        let balance = Self::get_balance(env, creator);
        balance.available_balance
    }
}
