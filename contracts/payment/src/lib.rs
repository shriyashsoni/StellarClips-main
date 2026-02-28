#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, token, Address, Env, Symbol};

const PLATFORM_FEE_BPS: i128 = 500; // 5% = 500 basis points
const BPS_DENOMINATOR: i128 = 10000;

#[contracttype]
#[derive(Clone)]
pub struct PaymentRecord {
    pub payment_id: u64,
    pub payer: Address,
    pub recipient: Address,
    pub amount: i128,
    pub platform_fee: i128,
    pub payment_type: Symbol, // "content" or "tip"
    pub content_id: Option<u64>,
    pub timestamp: u64,
}

#[contracttype]
pub enum DataKey {
    PaymentCounter,
    Payment(u64),
    PlatformAddress,
    TokenAddress,
}

#[contract]
pub struct PaymentContract;

#[contractimpl]
impl PaymentContract {
    /// Initialize contract with platform address and token
    pub fn initialize(env: Env, platform_address: Address, token_address: Address) {
        let platform_key = DataKey::PlatformAddress;
        let token_key = DataKey::TokenAddress;
        
        env.storage().instance().set(&platform_key, &platform_address);
        env.storage().instance().set(&token_key, &token_address);
    }

    /// Process content payment
    pub fn pay_for_content(
        env: Env,
        payer: Address,
        creator: Address,
        amount: i128,
        content_id: u64,
    ) -> u64 {
        payer.require_auth();

        let platform_address: Address = env
            .storage()
            .instance()
            .get(&DataKey::PlatformAddress)
            .expect("Platform address not set");

        let token_address: Address = env
            .storage()
            .instance()
            .get(&DataKey::TokenAddress)
            .expect("Token address not set");

        // Calculate platform fee
        let platform_fee = (amount * PLATFORM_FEE_BPS) / BPS_DENOMINATOR;
        let creator_amount = amount - platform_fee;

        // Transfer tokens
        let token_client = token::Client::new(&env, &token_address);
        
        // Transfer to creator
        token_client.transfer(&payer, &creator, &creator_amount);
        
        // Transfer platform fee
        token_client.transfer(&payer, &platform_address, &platform_fee);

        // Record payment
        let payment_id = Self::record_payment(
            env.clone(),
            payer.clone(),
            creator.clone(),
            amount,
            platform_fee,
            Symbol::new(&env, "content"),
            Some(content_id),
        );

        env.events().publish(
            (Symbol::new(&env, "payment_processed"),),
            (payment_id, payer, creator, amount, content_id),
        );

        payment_id
    }

    /// Send tip to creator
    pub fn send_tip(env: Env, tipper: Address, creator: Address, amount: i128) -> u64 {
        tipper.require_auth();

        let platform_address: Address = env
            .storage()
            .instance()
            .get(&DataKey::PlatformAddress)
            .expect("Platform address not set");

        let token_address: Address = env
            .storage()
            .instance()
            .get(&DataKey::TokenAddress)
            .expect("Token address not set");

        // Calculate platform fee
        let platform_fee = (amount * PLATFORM_FEE_BPS) / BPS_DENOMINATOR;
        let creator_amount = amount - platform_fee;

        // Transfer tokens
        let token_client = token::Client::new(&env, &token_address);
        token_client.transfer(&tipper, &creator, &creator_amount);
        token_client.transfer(&tipper, &platform_address, &platform_fee);

        // Record payment
        let payment_id = Self::record_payment(
            env.clone(),
            tipper.clone(),
            creator.clone(),
            amount,
            platform_fee,
            Symbol::new(&env, "tip"),
            None,
        );

        env.events().publish(
            (Symbol::new(&env, "tip_sent"),),
            (payment_id, tipper, creator, amount),
        );

        payment_id
    }

    /// Internal function to record payment
    fn record_payment(
        env: Env,
        payer: Address,
        recipient: Address,
        amount: i128,
        platform_fee: i128,
        payment_type: Symbol,
        content_id: Option<u64>,
    ) -> u64 {
        let counter_key = DataKey::PaymentCounter;
        let payment_id: u64 = env
            .storage()
            .persistent()
            .get(&counter_key)
            .unwrap_or(0);
        
        let new_payment_id = payment_id + 1;
        env.storage().persistent().set(&counter_key, &new_payment_id);

        let payment = PaymentRecord {
            payment_id: new_payment_id,
            payer,
            recipient,
            amount,
            platform_fee,
            payment_type,
            content_id,
            timestamp: env.ledger().timestamp(),
        };

        let payment_key = DataKey::Payment(new_payment_id);
        env.storage().persistent().set(&payment_key, &payment);

        new_payment_id
    }

    /// Get payment details
    pub fn get_payment(env: Env, payment_id: u64) -> Option<PaymentRecord> {
        let payment_key = DataKey::Payment(payment_id);
        env.storage().persistent().get(&payment_key)
    }
}
