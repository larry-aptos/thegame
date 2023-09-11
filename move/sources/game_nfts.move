module the_game::game_nfts {
    use std::error;
    use std::signer;
    use std::string::{String, utf8};
    use std::option;

    use aptos_framework::object::{Self, Object, TransferRef};
    use aptos_token_objects::collection;
    use aptos_token_objects::token;
    use aptos_token_objects::property_map;

    /// The account is not authorized to update the resources.
    const ENOT_AUTHORIZED: u64 = 1;
    /// Token is not owned by the user
    const ENOT_OWNER: u64 = 2;

    const COLLECTION_NAME: vector<u8> = b"The Game";
    const COLLECTION_DESCRIPTION: vector<u8> = b"";
    const COLLECTION_URI: vector<u8> = b"";
    
    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    struct CollectionConfig has key {
        mutator_ref: collection::MutatorRef,
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
    struct Play has key {}

    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    struct Attributes has key, drop {
        wins: u64,
        round: u64,
    }

    fun init_module(
        admin: &signer
    ) {
        collection::create_unlimited_collection(
            admin,
            utf8(COLLECTION_DESCRIPTION),
            utf8(COLLECTION_NAME),
            option::none(),
            utf8(COLLECTION_URI),
        );
    }

    entry fun mint(
        admin: &signer,
        mint_to: address,
        token_name: String,
        token_description: String,
        token_uri: String,
    ) {
        assert!(signer::address_of(admin) == @the_game, error::permission_denied(ENOT_AUTHORIZED));
        mint_internal(
            admin,
            mint_to,
            utf8(COLLECTION_NAME),
            token_name,
            token_description,
            token_uri,
        )
    }

    /// If player wins we need to update the player
    entry fun mark_player_win(
        admin: &signer,
        play: Object<Play>
    ) acquires Attributes, TokenMetadata {
        assert!(signer::address_of(admin) == @the_game, error::permission_denied(ENOT_AUTHORIZED));
        let attributes = borrow_global<Attributes>(object::object_address(&play));
        let wins = attributes.wins + 1;
        let round = attributes.round + 1;
        update_attributes(play, wins, round);
    }

    /// If player loses we need to burn the NFT
    entry fun mark_player_loss(
        admin: &signer,
        play: Object<Play>
    ) acquires TokenMetadata {
        assert!(signer::address_of(admin) == @the_game, error::permission_denied(ENOT_AUTHORIZED));
        // burn the nft
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

    // ======================================================================
    //   private helper functions //
    // ======================================================================

    fun mint_internal(
        admin: &signer,
        mint_to: address,
        collection: String,
        token_name: String,
        token_description: String,
        token_uri: String,
    ) {
        let constructor_ref = token::create_from_account(
            admin,
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
        // Move the object metadata to the token object
        let token_metadata = TokenMetadata {
            burn_ref,
            transfer_ref,
            mutator_ref,
            property_mutator_ref,
        };
        move_to(&object_signer, token_metadata);
    }

    fun update_attributes(
        player: Object<Play>,
        wins: u64,
        round: u64,
    ) acquires Attributes, TokenMetadata {
        let attributes = borrow_global_mut<Attributes>(object::object_address(&player));
        attributes.wins = wins;
        attributes.round = round;
        // Finally, update the property map
        let property_mutator_ref = &borrow_global<TokenMetadata>(object::object_address(&player)).property_mutator_ref;
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
    public(friend) fun creator_transfer(
        transfer_ref: &TransferRef,
        to: address,
    ) {
        let linear_transfer_ref = object::generate_linear_transfer_ref(transfer_ref);
        object::transfer_with_ref(linear_transfer_ref, to);
    }
}