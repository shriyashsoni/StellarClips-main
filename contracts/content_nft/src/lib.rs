#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String, Symbol, Vec};

#[contracttype]
#[derive(Clone)]
pub struct ContentMetadata {
    pub content_id: u64,
    pub creator: Address,
    pub metadata_uri: String,
    pub price: i128,
    pub created_at: u64,
    pub content_type: String,
}

#[contracttype]
pub enum DataKey {
    ContentCounter,
    Content(u64),
    CreatorContents(Address),
}

#[contract]
pub struct ContentNFTContract;

#[contractimpl]
impl ContentNFTContract {
    /// Mint new content NFT
    pub fn mint_content(
        env: Env,
        creator: Address,
        metadata_uri: String,
        price: i128,
        content_type: String,
    ) -> u64 {
        creator.require_auth();

        // Get and increment content counter
        let counter_key = DataKey::ContentCounter;
        let content_id: u64 = env
            .storage()
            .persistent()
            .get(&counter_key)
            .unwrap_or(0);
        
        let new_content_id = content_id + 1;
        env.storage().persistent().set(&counter_key, &new_content_id);

        // Create content metadata
        let content = ContentMetadata {
            content_id: new_content_id,
            creator: creator.clone(),
            metadata_uri: metadata_uri.clone(),
            price,
            created_at: env.ledger().timestamp(),
            content_type: content_type.clone(),
        };

        // Store content
        let content_key = DataKey::Content(new_content_id);
        env.storage().persistent().set(&content_key, &content);

        // Add to creator's content list
        let creator_key = DataKey::CreatorContents(creator.clone());
        let mut creator_contents: Vec<u64> = env
            .storage()
            .persistent()
            .get(&creator_key)
            .unwrap_or(Vec::new(&env));
        creator_contents.push_back(new_content_id);
        env.storage().persistent().set(&creator_key, &creator_contents);

        // Emit event
        env.events().publish(
            (Symbol::new(&env, "content_minted"),),
            (new_content_id, creator, price),
        );

        new_content_id
    }

    /// Get content information
    pub fn get_content(env: Env, content_id: u64) -> Option<ContentMetadata> {
        let content_key = DataKey::Content(content_id);
        env.storage().persistent().get(&content_key)
    }

    /// Update content URI (creator only)
    pub fn update_content_uri(env: Env, content_id: u64, new_uri: String) {
        let content_key = DataKey::Content(content_id);
        let mut content: ContentMetadata = env
            .storage()
            .persistent()
            .get(&content_key)
            .expect("Content not found");

        content.creator.require_auth();
        content.metadata_uri = new_uri;
        env.storage().persistent().set(&content_key, &content);

        env.events().publish(
            (Symbol::new(&env, "content_updated"),),
            (content_id, content.creator),
        );
    }

    /// Update content price (creator only)
    pub fn update_price(env: Env, content_id: u64, new_price: i128) {
        let content_key = DataKey::Content(content_id);
        let mut content: ContentMetadata = env
            .storage()
            .persistent()
            .get(&content_key)
            .expect("Content not found");

        content.creator.require_auth();
        content.price = new_price;
        env.storage().persistent().set(&content_key, &content);

        env.events().publish(
            (Symbol::new(&env, "price_updated"),),
            (content_id, new_price),
        );
    }

    /// Get all content IDs for a creator
    pub fn get_creator_contents(env: Env, creator: Address) -> Vec<u64> {
        let creator_key = DataKey::CreatorContents(creator);
        env.storage()
            .persistent()
            .get(&creator_key)
            .unwrap_or(Vec::new(&env))
    }
}
