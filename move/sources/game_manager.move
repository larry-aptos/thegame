module the_game::game_manager {
    use std::error;
    use std::signer;
    use std::string::{String, utf8};
    use std::option;
    use std::vector;
    use aptos_std::simple_map::{Self, SimpleMap};

    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::coin::{Self, Coin};
    use aptos_framework::object::{Self, Object, TransferRef};
    use aptos_token_objects::collection;
    use aptos_token_objects::token::{Self, Token};
    use aptos_token_objects::property_map;

    /// The account is not authorized to update the resources.
    const ENOT_AUTHORIZED: u64 = 1;
    /// Token is not owned by the user
    const ENOT_OWNER: u64 = 2;
    /// Pool must be empty to be cleared
    const ENOT_EMPTY: u64 = 3;

    const COLLECTION_NAME: vector<u8> = b"The Game";
    const COLLECTION_DESCRIPTION: vector<u8> = b"";
    const COLLECTION_URI: vector<u8> = b"";

    struct GameConfig has key {
        pool: Coin<AptosCoin>,
        eliminated: SimpleMap<address, PlayerStateView>,
        current: SimpleMap<address, Object<Token>>,
        secs_between_rounds: u64,
        buy_in: u64,
        joinable: bool,
        extend_ref: object::ExtendRef,
        max_players: u64,
        total_players: u64,
        num_max_winners: u64,
    }

    struct PlayerStateView has store, drop {
        is_alive: bool,
        wins: u64,
        nft_uri: String,
        potential_winning: u64,
        token_index: u64,
    }

    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    struct TokenMetadata has key {
        /// Used to burn.
        burn_ref: token::BurnRef,
        /// Used to control freeze.
        transfer_ref: object::TransferRef,
        /// Used to mutate fields
        mutator_ref: token::MutatorRef,
        /// Used to mutate properties
        property_mutator_ref: property_map::MutatorRef,
    }

    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    struct Play has key {
        index: u64,
    }

    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    struct Attributes has key, drop {
        wins: u64,
        round: u64,
    }

    fun init_module(
        admin: &signer
    ) {
        let constructor_ref = object::create_object_from_account(admin);
        let extend_ref = object::generate_extend_ref(&constructor_ref);
        let object_signer = object::generate_signer_for_extending(&extend_ref);
        collection::create_unlimited_collection(
            &object_signer,
            utf8(COLLECTION_DESCRIPTION),
            utf8(COLLECTION_NAME),
            option::none(),
            utf8(COLLECTION_URI),
        );
        move_to(admin, GameConfig {
            pool: coin::zero<AptosCoin>(),
            eliminated: simple_map::create(),
            current: simple_map::create(),
            secs_between_rounds: 0,
            buy_in: 0,
            joinable: false,
            extend_ref,
            max_players: 0,
            total_players: 0,
            num_max_winners: 0,
        })
    }

    /// Init game, only possible if the pool is empty
    entry fun init_game(
        admin: &signer,
        secs_between_rounds: u64,
        buy_in: u64,
        max_players: u64,
        num_max_winners: u64,
    ) acquires GameConfig {
        assert!(signer::address_of(admin) == @the_game, error::permission_denied(ENOT_AUTHORIZED));
        let game_config = borrow_global_mut<GameConfig>(@the_game);
        if (coin::value<AptosCoin>(&game_config.pool) > 0) {
            assert!(false, error::permission_denied(ENOT_EMPTY));
        };
        game_config.secs_between_rounds = secs_between_rounds;
        game_config.buy_in = buy_in;
        game_config.joinable = true;
        game_config.max_players = max_players;
        game_config.num_max_winners = num_max_winners;

        // reset player list
        game_config.eliminated = simple_map::create();
        game_config.current = simple_map::create();
    }

    /// Join game if not already in game and if the game is joinable
    entry fun join_game(
        user: &signer,
        token_name: String,
        token_description: String,
        token_uri: String,
    ) acquires GameConfig {
        let game_config = borrow_global_mut<GameConfig>(@the_game);
        // If game is at capacity, exit
        if (game_config.total_players >= game_config.max_players) {
            game_config.joinable = false;
        };
        game_config.total_players = game_config.total_players + 1;
        // If game is not joinable (or at capacity, exit)
        assert!(game_config.joinable, error::permission_denied(ENOT_AUTHORIZED));
        let amount = game_config.buy_in;
        let user_addr = signer::address_of(user);
        let coins = coin::withdraw<AptosCoin>(user, amount);
        // If user is already in game, exit
        if (simple_map::contains_key(&game_config.eliminated, &user_addr)) {
            assert!(false, error::permission_denied(ENOT_AUTHORIZED));
        };
        // If user is already in game, exit
        let minter = object::generate_signer_for_extending(&game_config.extend_ref);
        let token = mint(&minter, user_addr, token_name, token_description, token_uri, game_config.total_players);
        simple_map::add(&mut game_config.current, user_addr, token);
        coin::merge(&mut game_config.pool, coins);
    }

    /// Join game if not already in game and if the game is joinable
    entry fun close_joining(
        admin: &signer,
    ) acquires GameConfig {
        assert!(signer::address_of(admin) == @the_game, error::permission_denied(ENOT_AUTHORIZED));
        let game_config = borrow_global_mut<GameConfig>(@the_game);
        game_config.joinable = false;
    }

    /// Advance game to next round
    entry fun advance_game(
        admin: &signer,
        players_lost: vector<address>,
        players_won: vector<address>,
    ) acquires GameConfig, Play, Attributes, TokenMetadata {
        assert!(signer::address_of(admin) == @the_game, error::permission_denied(ENOT_AUTHORIZED));
        let game_config = borrow_global_mut<GameConfig>(@the_game);

        // handle user who won first
        while (!vector::is_empty(&players_won)) {
            let player = vector::pop_back(&mut players_won);
            let token_obj = simple_map::borrow(&game_config.current, &player);
            let play_obj = object::address_to_object(object::object_address(token_obj));
            mark_play_win(play_obj);
        };
        // handle user who lost
        while (!vector::is_empty(&players_lost)) {
            let player = vector::pop_back(&mut players_lost);
            let game_config = borrow_global_mut<GameConfig>(@the_game);
            let token_obj = simple_map::borrow(&game_config.current, &player);
            let uri = token::uri(*token_obj);
            let play_obj = object::address_to_object(object::object_address(token_obj));
            let token_index = borrow_global<Play>(object::object_address(token_obj)).index;
            let wins = borrow_global<Attributes>(object::object_address(token_obj)).wins;
            mark_play_loss(play_obj);
            simple_map::add(&mut game_config.eliminated, copy player, PlayerStateView {
                is_alive: false,
                wins,
                nft_uri: uri,
                potential_winning: 0,
                token_index,
            });
        };
    }

    /// End game
    entry fun end_game(
        admin: &signer,
    ) acquires GameConfig {
        assert!(signer::address_of(admin) == @the_game, error::permission_denied(ENOT_AUTHORIZED));
        let game_config = borrow_global_mut<GameConfig>(@the_game);
        game_config.joinable = false;
    }

    // ======================================================================
    //   private helper functions //
    // ======================================================================

    fun mint(
        minter: &signer,
        mint_to: address,
        token_name: String,
        token_description: String,
        token_uri: String,
        index: u64,
    ): Object<Token> {
        mint_internal(
            minter,
            mint_to,
            utf8(COLLECTION_NAME),
            token_name,
            token_description,
            token_uri,
            index,
        )
    }

    fun mint_internal(
        minter: &signer,
        mint_to: address,
        collection: String,
        token_name: String,
        token_description: String,
        token_uri: String,
        index: u64,
    ): Object<Token> {
        let constructor_ref = token::create_named_token(
            minter,
            collection,
            token_description,
            token_name,
            option::none(),
            token_uri,
        );
        let object_signer = object::generate_signer(&constructor_ref);
        let transfer_ref = object::generate_transfer_ref(&constructor_ref);
        let mutator_ref = token::generate_mutator_ref(&constructor_ref);
        let burn_ref = token::generate_burn_ref(&constructor_ref);
        let property_mutator_ref = property_map::generate_mutator_ref(&constructor_ref);
        // Transfers the token to the `claimer` address
        let linear_transfer_ref = object::generate_linear_transfer_ref(&transfer_ref);
        object::transfer_with_ref(linear_transfer_ref, mint_to);
        // Add the traits to the object
        let attributes = Attributes {
            wins: 0,
            round: 0,
        };
        // Initialize the property map for display
        let properties = property_map::prepare_input(vector[], vector[], vector[]);
        property_map::init(&constructor_ref, properties);
        add_attributes_property_map(&property_mutator_ref, &attributes);
        // move attributes to the token
        move_to(&object_signer, attributes);
        move_to(&object_signer, Play { index });
        // Move the object metadata to the token object
        let token_metadata = TokenMetadata {
            burn_ref,
            transfer_ref,
            mutator_ref,
            property_mutator_ref,
        };
        move_to(&object_signer, token_metadata);
        object::object_from_constructor_ref(&constructor_ref)
    }

    /// If player wins we need to update the player
    fun mark_play_win(
        play: Object<Play>
    ) acquires Attributes, TokenMetadata {
        let attributes = borrow_global<Attributes>(object::object_address(&play));
        let wins = attributes.wins + 1;
        let round = attributes.round + 1;
        update_attributes(play, wins, round);
    }

    /// If player loses we need to burn the NFT
    fun mark_play_loss(
        play: Object<Play>
    ) acquires Attributes, Play, TokenMetadata {
        // burn the nft
        move_from<Attributes>(object::object_address(&play));
        let Play { index: _ } = move_from<Play>(object::object_address(&play));
        let token_metadata = move_from<TokenMetadata>(object::object_address(&play));
        let TokenMetadata {
            burn_ref,
            transfer_ref: _,
            mutator_ref: _,
            property_mutator_ref,
        } = token_metadata;

        property_map::burn(property_mutator_ref);
        token::burn(burn_ref);
    }

    fun update_attributes(
        play: Object<Play>,
        wins: u64,
        round: u64,
    ) acquires Attributes, TokenMetadata {
        let attributes = borrow_global_mut<Attributes>(object::object_address(&play));
        attributes.wins = wins;
        attributes.round = round;
        // Finally, update the property map
        let property_mutator_ref = &borrow_global<TokenMetadata>(object::object_address(&play)).property_mutator_ref;
        update_attributes_property_map(property_mutator_ref, &Attributes {
            wins,
            round,
        });
    }

    fun add_attributes_property_map(
        mutator_ref: &property_map::MutatorRef,
        attributes: &Attributes
    ) {
        property_map::add_typed(
            mutator_ref,
            utf8(b"Wins"),
            attributes.wins,
        );
        property_map::add_typed(
            mutator_ref,
            utf8(b"Round"),
            attributes.round,
        );
    }

    fun update_attributes_property_map(
        mutator_ref: &property_map::MutatorRef,
        attributes: &Attributes
    ) {
        property_map::update_typed(
            mutator_ref,
            &utf8(b"Wins"),
            attributes.wins,
        );
        property_map::update_typed(
            mutator_ref,
            &utf8(b"Round"),
            attributes.round,
        );
    }

    /// to can be user or object
    fun creator_transfer(
        transfer_ref: &TransferRef,
        to: address,
    ) {
        let linear_transfer_ref = object::generate_linear_transfer_ref(transfer_ref);
        object::transfer_with_ref(linear_transfer_ref, to);
    }

    /// Returns the signer of the collection.
    fun collection_manager_signer(): signer acquires GameConfig {
        let manager = borrow_global<GameConfig>(@the_game);
        object::generate_signer_for_extending(&manager.extend_ref)
    }
}