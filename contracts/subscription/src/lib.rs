#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String, Symbol};

#[contracttype]
#[derive(Clone)]
pub struct SubscriptionTier {
    pub tier_id: u64,
    pub creator: Address,
    pub name: String,
    pub price: i128,
    pub duration_days: u32,
}

#[contracttype]
#[derive(Clone)]
pub struct Subscription {
    pub subscriber: Address,
    pub creator: Address,
    pub tier_id: u64,
    pub start_date: u64,
    pub expiry_date: u64,
    pub auto_renew: bool,
}

#[contracttype]
pub enum DataKey {
    TierCounter,
    Tier(u64),
    CreatorTiers(Address),
    Subscription(Address, Address), // (subscriber, creator)
}

#[contract]
pub struct SubscriptionContract;

#[contractimpl]
impl SubscriptionContract {
    /// Create a new subscription tier
    pub fn create_tier(
        env: Env,
        creator: Address,
        name: String,
        price: i128,
        duration_days: u32,
    ) -> u64 {
        creator.require_auth();

        let counter_key = DataKey::TierCounter;
        let tier_id: u64 = env
            .storage()
            .persistent()
            .get(&counter_key)
            .unwrap_or(0);
        
        let new_tier_id = tier_id + 1;
        env.storage().persistent().set(&counter_key, &new_tier_id);

        let tier = SubscriptionTier {
            tier_id: new_tier_id,
            creator: creator.clone(),
            name: name.clone(),
            price,
            duration_days,
        };

        let tier_key = DataKey::Tier(new_tier_id);
        env.storage().persistent().set(&tier_key, &tier);

        env.events().publish(
            (Symbol::new(&env, "tier_created"),),
            (new_tier_id, creator, price),
        );

        new_tier_id
    }

    /// Subscribe to a creator
    pub fn subscribe(
        env: Env,
        subscriber: Address,
        creator: Address,
        tier_id: u64,
        auto_renew: bool,
    ) {
        subscriber.require_auth();

        let tier_key = DataKey::Tier(tier_id);
        let tier: SubscriptionTier = env
            .storage()
            .persistent()
            .get(&tier_key)
            .expect("Tier not found");

        let start_date = env.ledger().timestamp();
        let duration_seconds = (tier.duration_days as u64) * 86400;
        let expiry_date = start_date + duration_seconds;

        let subscription = Subscription {
            subscriber: subscriber.clone(),
            creator: creator.clone(),
            tier_id,
            start_date,
            expiry_date,
            auto_renew,
        };

        let sub_key = DataKey::Subscription(subscriber.clone(), creator.clone());
        env.storage().persistent().set(&sub_key, &subscription);

        env.events().publish(
            (Symbol::new(&env, "subscribed"),),
            (subscriber, creator, tier_id, expiry_date),
        );
    }

    /// Check if subscription is active
    pub fn is_subscribed(env: Env, subscriber: Address, creator: Address) -> bool {
        let sub_key = DataKey::Subscription(subscriber, creator);
        
        if let Some(subscription) = env.storage().persistent().get::<DataKey, Subscription>(&sub_key) {
            let current_time = env.ledger().timestamp();
            return current_time < subscription.expiry_date;
        }
        
        false
    }

    /// Get subscription details
    pub fn get_subscription(
        env: Env,
        subscriber: Address,
        creator: Address,
    ) -> Option<Subscription> {
        let sub_key = DataKey::Subscription(subscriber, creator);
        env.storage().persistent().get(&sub_key)
    }

    /// Cancel subscription (disable auto-renew)
    pub fn cancel_subscription(env: Env, subscriber: Address, creator: Address) {
        subscriber.require_auth();

        let sub_key = DataKey::Subscription(subscriber.clone(), creator.clone());
        let mut subscription: Subscription = env
            .storage()
            .persistent()
            .get(&sub_key)
            .expect("Subscription not found");

        subscription.auto_renew = false;
        env.storage().persistent().set(&sub_key, &subscription);

        env.events().publish(
            (Symbol::new(&env, "subscription_cancelled"),),
            (subscriber, creator),
        );
    }

    /// Renew subscription
    pub fn renew_subscription(env: Env, subscriber: Address, creator: Address, tier_id: u64) {
        subscriber.require_auth();

        let tier_key = DataKey::Tier(tier_id);
        let tier: SubscriptionTier = env
            .storage()
            .persistent()
            .get(&tier_key)
            .expect("Tier not found");

        let sub_key = DataKey::Subscription(subscriber.clone(), creator.clone());
        let mut subscription: Subscription = env
            .storage()
            .persistent()
            .get(&sub_key)
            .expect("Subscription not found");

        let duration_seconds = (tier.duration_days as u64) * 86400;
        subscription.expiry_date = env.ledger().timestamp() + duration_seconds;
        
        env.storage().persistent().set(&sub_key, &subscription);

        env.events().publish(
            (Symbol::new(&env, "subscription_renewed"),),
            (subscriber, creator, subscription.expiry_date),
        );
    }

    /// Get tier information
    pub fn get_tier(env: Env, tier_id: u64) -> Option<SubscriptionTier> {
        let tier_key = DataKey::Tier(tier_id);
        env.storage().persistent().get(&tier_key)
    }
}
