module the_game::profile {
    use std::error;
    use std::signer;
    use std::string::{String, utf8};
    use std::option;

    use aptos_framework::aptos_account;
    use aptos_framework::object::{Self, Object};
    use aptos_token_objects::collection;
    use aptos_token_objects::token;
    
    friend the_game::game_manager;

    /// The account is not authorized to update the resources.
    const ENOT_AUTHORIZED: u64 = 1;
    /// Token is not owned by the user
    const ENOT_OWNER: u64 = 2;

    const PROFILE_COLLECTION_NAME: vector<u8> = b"B.FLY Profile";
    const PROFILE_COLLECTION_DESCRIPTION: vector<u8> = b"This is your soulbound token that proves you have a profile in the B.FLY ecosystem of risk-based on-chain games.";
    const PROFILE_COLLECTION_URI: vector<u8> = b"https://storage.googleapis.com/space-fighters-assets/profile_collection.png";
    
    const PROFILE_TOKEN_NAME: vector<u8> = b"B.FLY Player";
    const PROFILE_TOKEN_DESCRIPTION: vector<u8> = b"This is your soulbound token that proves you have a profile in the B.FLY ecosystem of risk-based on-chain games.";
    const PROFILE_TOKEN_URI: vector<u8> = b"https://storage.googleapis.com/space-fighters-assets/profile_collection.jpg";

    const THE_GAME_STATS_COLLECTION_NAME: vector<u8> = b"The Game Stats";
    const THE_GAME_STATS_COLLECTION_DESCRIPTION: vector<u8> = b"This collection is not tradable! It provides records of progress in game.";
    const THE_GAME_STATS_COLLECTION_URI: vector<u8> = b"";
    
    const THE_GAME_STATS_TOKEN_NAME: vector<u8> = b"Records";
    const THE_GAME_STATS_TOKEN_DESCRIPTION: vector<u8> = b"";
    const THE_GAME_STATS_TOKEN_URI: vector<u8> = b"";

    // This will be in user's account
    struct BFlyProfile has key {
        profile: Object<TheGameProfile>,
    }

    struct ProfileConfig has key {
        extend_ref: object::ExtendRef,
    }

    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    struct TokenMetadata has key {
        /// Used to burn.
        burn_ref: token::BurnRef,
        /// Used to control freeze.
        transfer_ref: object::TransferRef,
        /// Used to mutate fields
        mutator_ref: token::MutatorRef,
    }

    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    struct TheGameProfile has key {
        records: Object<TheGameRecords>,
    }

    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    struct TheGameRecords has key {
        games_played: u64,
        total_kills: u64,
        total_prize_earned: u64,
    }

    struct TheGameProfileView has drop {
        game_name: String,
        games_played: u64,
        total_kills: u64,
        total_prize_earned: u64,
    }

    fun init_module(
        admin: &signer,
    ) {
        let constructor_ref = object::create_object_from_account(admin);
        let extend_ref = object::generate_extend_ref(&constructor_ref);
        let object_signer = object::generate_signer_for_extending(&extend_ref);
        aptos_account::create_account(signer::address_of(&object_signer));
        create_profile_collection(&object_signer);
        create_game_stats_collection(&object_signer);
        move_to(admin, ProfileConfig {
            extend_ref,
        })
    }

    public(friend) fun mint_profile_and_game_stats(
        user: &signer,
    ) acquires ProfileConfig, TokenMetadata {
        // if profile already exists, do nothing
        if (exists<BFlyProfile>(signer::address_of(user))) {
            return
        };
        let extend_ref = &borrow_global<ProfileConfig>(@the_game).extend_ref;
        let object_minter = object::generate_signer_for_extending(extend_ref);
        let game_stats = mint_game_stats(&object_minter);
        let profile = mint_profile(&object_minter, signer::address_of(user), game_stats);
        move_to(user, BFlyProfile {
            profile,
        });
    }

    fun mint_profile(
        object_minter: &signer,
        mint_to: address,
        game_stats: Object<TheGameRecords>,
    ): Object<TheGameProfile> acquires TokenMetadata {
        let constructor_ref = token::create_from_account(
            object_minter,
            utf8(PROFILE_COLLECTION_NAME),
            utf8(PROFILE_TOKEN_DESCRIPTION),
            utf8(PROFILE_TOKEN_NAME),
            option::none(),
            utf8(PROFILE_TOKEN_URI),
        );
        let object_signer = object::generate_signer(&constructor_ref);
        let transfer_ref = object::generate_transfer_ref(&constructor_ref);
        let mutator_ref = token::generate_mutator_ref(&constructor_ref);
        let burn_ref = token::generate_burn_ref(&constructor_ref);

        // Transfers the token to the `mint_to` address
        creator_transfer(&transfer_ref, mint_to);
        // Disables ungated transfer, thus making the token soulbound and non-transferable
        object::disable_ungated_transfer(&transfer_ref);

        let game_stats_transfer_ref = &borrow_global<TokenMetadata>(object::object_address(&game_stats)).transfer_ref;
        // Transfers stats to profile object
        creator_transfer(game_stats_transfer_ref, signer::address_of(&object_signer));

        let token_metadata = TokenMetadata {
            burn_ref,
            transfer_ref,
            mutator_ref,
        };
        move_to(&object_signer, token_metadata);

        let profile = TheGameProfile {
            records: game_stats,
        };
        move_to(&object_signer, profile);

        object::object_from_constructor_ref(&constructor_ref)
    }

    fun mint_game_stats(
        object_minter: &signer,
    ): Object<TheGameRecords> {
        let constructor_ref = token::create_from_account(
            object_minter,
            utf8(THE_GAME_STATS_COLLECTION_NAME),
            utf8(THE_GAME_STATS_TOKEN_DESCRIPTION),
            utf8(THE_GAME_STATS_TOKEN_NAME),
            option::none(),
            utf8(THE_GAME_STATS_TOKEN_URI),
        );
        let object_signer = object::generate_signer(&constructor_ref);
        let transfer_ref = object::generate_transfer_ref(&constructor_ref);
        let mutator_ref = token::generate_mutator_ref(&constructor_ref);
        let burn_ref = token::generate_burn_ref(&constructor_ref);

        // Disables ungated transfer, thus making the token soulbound and non-transferable
        // This will be transferred later to the profile object
        object::disable_ungated_transfer(&transfer_ref);

        let token_metadata = TokenMetadata {
            burn_ref,
            transfer_ref,
            mutator_ref,
        };
        move_to(&object_signer, token_metadata);

        let stats = TheGameRecords {
            games_played: 0,
            total_kills: 0,
            total_prize_earned: 0,
        };
        move_to(&object_signer, stats);

        object::object_from_constructor_ref(&constructor_ref)
    }

    public(friend) fun save_game_result(
        admin: &signer,
        owner: address,
        kills: u64,
        prize_earned: u64
    ) acquires BFlyProfile, TheGameProfile, TheGameRecords {
        assert!(signer::address_of(admin) == @the_game, error::permission_denied(ENOT_AUTHORIZED));
        let profile = &borrow_global<BFlyProfile>(owner).profile;
        let record_obj = &borrow_global<TheGameProfile>(object::object_address(profile)).records;
        let record = borrow_global_mut<TheGameRecords>(object::object_address(record_obj));
        record.games_played = record.games_played + 1;
        record.total_kills = record.total_kills + kills;
        record.total_prize_earned = record.total_prize_earned + prize_earned;
    }

    #[view]
    public fun view_stats(
        owner: address,
    ): TheGameProfileView acquires BFlyProfile, TheGameProfile, TheGameRecords {
        let profile = &borrow_global<BFlyProfile>(owner).profile;
        let record_obj = &borrow_global<TheGameProfile>(object::object_address(profile)).records;
        let record = borrow_global<TheGameRecords>(object::object_address(record_obj));
        TheGameProfileView {
            game_name: utf8(b"The Game"),
            games_played: record.games_played,
            total_kills: record.total_kills,
            total_prize_earned: record.total_prize_earned,
        }
    }

    fun create_profile_collection(
        object_signer: &signer
    ) {
        collection::create_unlimited_collection(
            object_signer,
            utf8(PROFILE_COLLECTION_DESCRIPTION),
            utf8(PROFILE_COLLECTION_NAME),
            option::none(),
            utf8(PROFILE_COLLECTION_URI),
        );
    }

    fun create_game_stats_collection(
        object_signer: &signer
    ) {
        collection::create_unlimited_collection(
            object_signer,
            utf8(THE_GAME_STATS_COLLECTION_DESCRIPTION),
            utf8(THE_GAME_STATS_COLLECTION_NAME),
            option::none(),
            utf8(THE_GAME_STATS_COLLECTION_URI),
        );
    }

    /// to can be user or object
    fun creator_transfer(
        transfer_ref: &object::TransferRef,
        to: address,
    ) {
        let linear_transfer_ref = object::generate_linear_transfer_ref(transfer_ref);
        object::transfer_with_ref(linear_transfer_ref, to);
    }
}