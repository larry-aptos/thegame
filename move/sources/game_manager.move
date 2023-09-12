module the_game::game_manager {
    use std::error;
    use std::signer;
    use std::string::{Self, String, utf8};
    use std::option;
    use std::vector;
    use aptos_std::math64;
    use aptos_std::simple_map::{Self, SimpleMap};

    use aptos_framework::account;
    use aptos_framework::aptos_account;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::coin::{Self, Coin};
    use aptos_framework::object::{Self, Object, TransferRef};
    use aptos_framework::timestamp;
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
    const COLLECTION_DESCRIPTION: vector<u8> = b"Welcome to THE GAME - An interactive, risk based, gamified and social experience on Aptos. Are you going to be the last person standing?";
    const COLLECTION_URI: vector<u8> = b"https://storage.googleapis.com/space-fighters-assets/game_collection.png";

    const NFT_NAME: vector<u8> = b"Player";
    const NFT_DESCRIPTION: vector<u8> = b"Welcome to THE GAME - An interactive, risk based, gamified and social experience on Aptos. Are you going to be the last person standing?";
    const NFT_URI_PREFIX: vector<u8> = b"https://storage.googleapis.com/space-fighters-assets/";
    const NFT_URIS: vector<vector<u8>> = vector[
        b"alligator1.png",
        b"alligator2.png",
        b"alligator3.png",
        b"alligator4.png",
        b"alligator5.png",
        b"alligator6.png",
        b"alligator7.png",
        b"alligator8.png",
        b"alligator9.png",
        b"alligator10.png",
        b"alligator11.png",
        b"alligator12.png",
        b"alligator13.png",
        b"kangaroo1.png",
        b"kangaroo2.png",
        b"kangaroo3.png",
        b"kangaroo4.png",
        b"kangaroo5.png",
        b"kangaroo6.png",
        b"kangaroo7.png",
        b"kangaroo8.png",
        b"kangaroo9.png",
        b"kangaroo10.png",
        b"kangaroo11.png",
        b"kangaroo12.png",
        b"kangaroo13.png",
        b"monkey1.png",
        b"monkey2.png",
        b"monkey3.png",
        b"monkey4.png",
        b"monkey5.png",
        b"monkey6.png",
        b"monkey7.png",
        b"monkey8.png",
        b"monkey9.png",
        b"monkey10.png",
        b"monkey11.png",
        b"monkey12.png",
        b"monkey13.png",
        b"panda1.png",
        b"panda2.png",
        b"panda3.png",
        b"panda4.png",
        b"panda5.png",
        b"panda6.png",
        b"panda7.png",
        b"panda8.png",
        b"panda9.png",
        b"panda10.png",
        b"panda11.png",
        b"panda12.png",
        b"panda13.png",
        b"parrot1.png",
        b"parrot2.png",
        b"parrot3.png",
        b"parrot4.png",
        b"parrot5.png",
        b"parrot6.png",
        b"parrot7.png",
        b"parrot8.png",
        b"parrot9.png",
        b"parrot10.png",
        b"parrot11.png",
        b"parrot12.png"
    ];
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
        available_nfts: vector<String>,
    }

    struct PlayerStateView has copy, store, drop {
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
        prize: Coin<AptosCoin>,
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
            available_nfts: vector[],
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
        game_config.max_players = math64::min(max_players, vector::length(&NFT_URIS));
        game_config.num_max_winners = num_max_winners;
        game_config.available_nfts = vector[];
        let i = 0;
        while (i < vector::length(&NFT_URIS)) {
            let nft_uri = vector::borrow(&NFT_URIS, i);
            vector::push_back(&mut game_config.available_nfts, utf8(*nft_uri));
            i = i + 1;
        };

        // reset player list
        game_config.eliminated = simple_map::create();
        game_config.current = simple_map::create();
    }

    /// Clear the pool by putting all the pool money to the admin. Testing only
    entry fun force_clear_pool(
        admin: &signer,
    ) acquires GameConfig {
        assert!(signer::address_of(admin) == @the_game, error::permission_denied(ENOT_AUTHORIZED));
        let pool = &mut borrow_global_mut<GameConfig>(@the_game).pool;
        let coins = coin::extract_all(pool);
        coin::deposit<AptosCoin>(signer::address_of(admin), coins);
    }

    /// Join game if not already in game and if the game is joinable
    entry fun join_game(
        user: &signer,
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
        // randomly pick a token uri
        let random_index = timestamp::now_microseconds() % vector::length(&game_config.available_nfts);
        let suffix = vector::remove(&mut game_config.available_nfts, random_index);
        let token_uri = utf8(NFT_URI_PREFIX);
        string::append(&mut token_uri, suffix);
        let token = mint(&minter, user_addr, utf8(NFT_NAME), utf8(NFT_DESCRIPTION), token_uri, game_config.total_players);
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
        game_config.joinable = false;

        // handle user who won first
        while (!vector::is_empty(&players_won)) {
            let player = vector::pop_back(&mut players_won);
            let token_obj = simple_map::borrow(&game_config.current, &player);
            let play = object::convert<Token, Play>(*token_obj);
            mark_play_win(play);
        };
        // handle user who lost
        while (!vector::is_empty(&players_lost)) {
            let player = vector::pop_back(&mut players_lost);
            let token_obj = simple_map::borrow(&game_config.current, &player);
            let player_state_view = convert_token_to_player_state_view(*token_obj, false);
            let play = object::convert<Token, Play>(*token_obj);
            mark_play_loss(play);
            simple_map::remove(&mut game_config.current, &player);
            simple_map::add(&mut game_config.eliminated, player, player_state_view);
        };
    }

    /// End game
    entry fun end_game(
        admin: &signer,
    ) acquires GameConfig, Play, Attributes, TokenMetadata {
        assert!(signer::address_of(admin) == @the_game, error::permission_denied(ENOT_AUTHORIZED));
        let end_state = view_latest_states();
        let game_config = borrow_global_mut<GameConfig>(@the_game);
        let pool = &mut game_config.pool;
        // loop through current users and give money
        let current_players = simple_map::keys(&game_config.current);
        while (vector::length(&current_players) > 0) {
            let player_won = vector::pop_back(&mut current_players);
            let amount = simple_map::borrow(&end_state, &player_won).potential_winning;
            let coins = coin::extract<AptosCoin>(pool, amount);
            // send money to the user's token
            let token_obj = simple_map::borrow(&game_config.current, &player_won);
            let play = borrow_global_mut<Play>(object::object_address(token_obj));
            coin::merge(&mut play.prize, coins);
            // Modify NFTs as well
            let token_uri = &simple_map::borrow(&end_state, &player_won).nft_uri;
            let new_suffix = if (string::index_of(token_uri, &utf8(b"alligator")) < string::length(token_uri)) {
                utf8(b"alligator_win.png")
            } else if (string::index_of(token_uri, &utf8(b"kangaroo")) < string::length(token_uri)) {
                utf8(b"kangaroo_win.png")
            } else if (string::index_of(token_uri, &utf8(b"monkey")) < string::length(token_uri)) {
                utf8(b"monkey_win.png")
            } else if (string::index_of(token_uri, &utf8(b"panda")) < string::length(token_uri)) {
                utf8(b"panda_win.png")
            } else if (string::index_of(token_uri, &utf8(b"parrot")) < string::length(token_uri)) {
                utf8(b"parrot_win.png")
            } else {
                utf8(b"")
            };
            let token_uri = utf8(NFT_URI_PREFIX);
            string::append(&mut token_uri, new_suffix);
            let mutator_ref = &borrow_global<TokenMetadata>(object::object_address(token_obj)).mutator_ref;
            token::set_uri(mutator_ref, token_uri);
        };
        // pay the rest to the last player
        let last_player = vector::pop_back(&mut current_players);
        let token_obj = simple_map::borrow(&game_config.current, &last_player);
        let play = borrow_global_mut<Play>(object::object_address(token_obj));
        coin::merge(&mut play.prize, coin::extract_all<AptosCoin>(pool));
    }

    /// Claim coin
    entry fun claim(
        claimer: &signer,
        token: Object<Token>,
    ) acquires Play {
        let claimer_addr = signer::address_of(claimer);
        let owner = object::owner(token);
        assert!(claimer_addr == owner, error::permission_denied(ENOT_OWNER));
        let play = borrow_global_mut<Play>(object::object_address(&token));
        let coins = coin::extract_all(&mut play.prize);
        coin::deposit<AptosCoin>(claimer_addr, coins);
    }

    #[view]
    public fun view_latest_states(): SimpleMap<address, PlayerStateView> acquires GameConfig, Play, Attributes {
        let game_config = borrow_global<GameConfig>(@the_game);
        let player_states = simple_map::create<address, PlayerStateView>();
        // Loop through alive players
        let current_players = simple_map::keys(&game_config.current);
        let i = 0;
        let win_sum = 0;
        let total_coin = coin::value<AptosCoin>(&game_config.pool);
        while (i < vector::length(&current_players)) {
            let current_player = vector::borrow(&current_players, i);
            let token_obj = simple_map::borrow(&game_config.current, current_player);
            let player_state_view = convert_token_to_player_state_view(*token_obj, true);
            let wins = player_state_view.wins;
            win_sum = win_sum + wins;
            simple_map::add(&mut player_states, *current_player, player_state_view);
            i = i + 1;
        };
        // Calculate the payout of alive players
        let i = 0;
        if (win_sum > 0) {
            while (i < vector::length(&current_players)) {
                let current_player = vector::borrow(&current_players, i);
                let player_state = simple_map::borrow_mut(&mut player_states, current_player);
                player_state.potential_winning = math64::mul_div(total_coin, player_state.wins, win_sum);
                i = i + 1;
            }
        };
        // Loop through eliminated players
        let eliminated_players = simple_map::keys(&game_config.eliminated);
        let i = 0;
        while (i < vector::length(&eliminated_players)) {
            let eliminated_player = vector::borrow(&eliminated_players, i);
            let player_state_view = simple_map::borrow(&game_config.eliminated, eliminated_player);
            simple_map::add(&mut player_states, *eliminated_player, *player_state_view);
            i = i + 1;
        };
        player_states
    }

    #[view]
    public fun view_current_pool(): u64 acquires GameConfig {
        let game_config = borrow_global<GameConfig>(@the_game);
        coin::value<AptosCoin>(&game_config.pool)
    }

    #[view]
    public fun view_prize(
        token: Object<Play>
    ): u64 acquires Play {
        let play = borrow_global<Play>(object::object_address(&token));
        coin::value<AptosCoin>(&play.prize)
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
        // we probably don't want this
        if (!account::exists_at(signer::address_of(minter))) {
            aptos_account::create_account(signer::address_of(minter));
        };
        let constructor_ref = token::create_from_account(
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
        move_to(&object_signer, Play {
            index,
            prize: coin::zero<AptosCoin>(),
        });
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
        let Play { index: _, prize: zero_coin } = move_from<Play>(object::object_address(&play));
        coin::destroy_zero(zero_coin);
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

    fun convert_token_to_player_state_view(
        token: Object<Token>,
        is_alive: bool,
    ): PlayerStateView acquires Play, Attributes {
        let uri = token::uri(token);
        let token_index = borrow_global<Play>(object::object_address(&token)).index;
        let wins = borrow_global<Attributes>(object::object_address(&token)).wins;
        PlayerStateView {
            is_alive,
            wins,
            nft_uri: uri,
            potential_winning: 0,
            token_index,
        }
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