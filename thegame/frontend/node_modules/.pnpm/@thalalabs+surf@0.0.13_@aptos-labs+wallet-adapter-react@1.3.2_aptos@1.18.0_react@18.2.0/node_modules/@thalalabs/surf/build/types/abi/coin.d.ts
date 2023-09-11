export declare const COIN_ABI: {
    readonly address: "0x1";
    readonly name: "coin";
    readonly friends: readonly ["0x1::aptos_coin", "0x1::genesis", "0x1::transaction_fee"];
    readonly exposed_functions: readonly [{
        readonly name: "allow_supply_upgrades";
        readonly visibility: "public";
        readonly is_entry: false;
        readonly is_view: false;
        readonly generic_type_params: readonly [];
        readonly params: readonly ["&signer", "bool"];
        readonly return: readonly [];
    }, {
        readonly name: "balance";
        readonly visibility: "public";
        readonly is_entry: false;
        readonly is_view: true;
        readonly generic_type_params: readonly [{
            readonly constraints: readonly [];
        }];
        readonly params: readonly ["address"];
        readonly return: readonly ["u64"];
    }, {
        readonly name: "burn";
        readonly visibility: "public";
        readonly is_entry: false;
        readonly is_view: false;
        readonly generic_type_params: readonly [{
            readonly constraints: readonly [];
        }];
        readonly params: readonly ["0x1::coin::Coin<T0>", "&0x1::coin::BurnCapability<T0>"];
        readonly return: readonly [];
    }, {
        readonly name: "burn_from";
        readonly visibility: "public";
        readonly is_entry: false;
        readonly is_view: false;
        readonly generic_type_params: readonly [{
            readonly constraints: readonly [];
        }];
        readonly params: readonly ["address", "u64", "&0x1::coin::BurnCapability<T0>"];
        readonly return: readonly [];
    }, {
        readonly name: "collect_into_aggregatable_coin";
        readonly visibility: "friend";
        readonly is_entry: false;
        readonly is_view: false;
        readonly generic_type_params: readonly [{
            readonly constraints: readonly [];
        }];
        readonly params: readonly ["address", "u64", "&mut 0x1::coin::AggregatableCoin<T0>"];
        readonly return: readonly [];
    }, {
        readonly name: "decimals";
        readonly visibility: "public";
        readonly is_entry: false;
        readonly is_view: true;
        readonly generic_type_params: readonly [{
            readonly constraints: readonly [];
        }];
        readonly params: readonly [];
        readonly return: readonly ["u8"];
    }, {
        readonly name: "deposit";
        readonly visibility: "public";
        readonly is_entry: false;
        readonly is_view: false;
        readonly generic_type_params: readonly [{
            readonly constraints: readonly [];
        }];
        readonly params: readonly ["address", "0x1::coin::Coin<T0>"];
        readonly return: readonly [];
    }, {
        readonly name: "destroy_burn_cap";
        readonly visibility: "public";
        readonly is_entry: false;
        readonly is_view: false;
        readonly generic_type_params: readonly [{
            readonly constraints: readonly [];
        }];
        readonly params: readonly ["0x1::coin::BurnCapability<T0>"];
        readonly return: readonly [];
    }, {
        readonly name: "destroy_freeze_cap";
        readonly visibility: "public";
        readonly is_entry: false;
        readonly is_view: false;
        readonly generic_type_params: readonly [{
            readonly constraints: readonly [];
        }];
        readonly params: readonly ["0x1::coin::FreezeCapability<T0>"];
        readonly return: readonly [];
    }, {
        readonly name: "destroy_mint_cap";
        readonly visibility: "public";
        readonly is_entry: false;
        readonly is_view: false;
        readonly generic_type_params: readonly [{
            readonly constraints: readonly [];
        }];
        readonly params: readonly ["0x1::coin::MintCapability<T0>"];
        readonly return: readonly [];
    }, {
        readonly name: "destroy_zero";
        readonly visibility: "public";
        readonly is_entry: false;
        readonly is_view: false;
        readonly generic_type_params: readonly [{
            readonly constraints: readonly [];
        }];
        readonly params: readonly ["0x1::coin::Coin<T0>"];
        readonly return: readonly [];
    }, {
        readonly name: "drain_aggregatable_coin";
        readonly visibility: "friend";
        readonly is_entry: false;
        readonly is_view: false;
        readonly generic_type_params: readonly [{
            readonly constraints: readonly [];
        }];
        readonly params: readonly ["&mut 0x1::coin::AggregatableCoin<T0>"];
        readonly return: readonly ["0x1::coin::Coin<T0>"];
    }, {
        readonly name: "extract";
        readonly visibility: "public";
        readonly is_entry: false;
        readonly is_view: false;
        readonly generic_type_params: readonly [{
            readonly constraints: readonly [];
        }];
        readonly params: readonly ["&mut 0x1::coin::Coin<T0>", "u64"];
        readonly return: readonly ["0x1::coin::Coin<T0>"];
    }, {
        readonly name: "extract_all";
        readonly visibility: "public";
        readonly is_entry: false;
        readonly is_view: false;
        readonly generic_type_params: readonly [{
            readonly constraints: readonly [];
        }];
        readonly params: readonly ["&mut 0x1::coin::Coin<T0>"];
        readonly return: readonly ["0x1::coin::Coin<T0>"];
    }, {
        readonly name: "freeze_coin_store";
        readonly visibility: "public";
        readonly is_entry: true;
        readonly is_view: false;
        readonly generic_type_params: readonly [{
            readonly constraints: readonly [];
        }];
        readonly params: readonly ["address", "&0x1::coin::FreezeCapability<T0>"];
        readonly return: readonly [];
    }, {
        readonly name: "initialize";
        readonly visibility: "public";
        readonly is_entry: false;
        readonly is_view: false;
        readonly generic_type_params: readonly [{
            readonly constraints: readonly [];
        }];
        readonly params: readonly ["&signer", "0x1::string::String", "0x1::string::String", "u8", "bool"];
        readonly return: readonly ["0x1::coin::BurnCapability<T0>", "0x1::coin::FreezeCapability<T0>", "0x1::coin::MintCapability<T0>"];
    }, {
        readonly name: "initialize_aggregatable_coin";
        readonly visibility: "friend";
        readonly is_entry: false;
        readonly is_view: false;
        readonly generic_type_params: readonly [{
            readonly constraints: readonly [];
        }];
        readonly params: readonly ["&signer"];
        readonly return: readonly ["0x1::coin::AggregatableCoin<T0>"];
    }, {
        readonly name: "initialize_supply_config";
        readonly visibility: "friend";
        readonly is_entry: false;
        readonly is_view: false;
        readonly generic_type_params: readonly [];
        readonly params: readonly ["&signer"];
        readonly return: readonly [];
    }, {
        readonly name: "initialize_with_parallelizable_supply";
        readonly visibility: "friend";
        readonly is_entry: false;
        readonly is_view: false;
        readonly generic_type_params: readonly [{
            readonly constraints: readonly [];
        }];
        readonly params: readonly ["&signer", "0x1::string::String", "0x1::string::String", "u8", "bool"];
        readonly return: readonly ["0x1::coin::BurnCapability<T0>", "0x1::coin::FreezeCapability<T0>", "0x1::coin::MintCapability<T0>"];
    }, {
        readonly name: "is_account_registered";
        readonly visibility: "public";
        readonly is_entry: false;
        readonly is_view: true;
        readonly generic_type_params: readonly [{
            readonly constraints: readonly [];
        }];
        readonly params: readonly ["address"];
        readonly return: readonly ["bool"];
    }, {
        readonly name: "is_aggregatable_coin_zero";
        readonly visibility: "friend";
        readonly is_entry: false;
        readonly is_view: false;
        readonly generic_type_params: readonly [{
            readonly constraints: readonly [];
        }];
        readonly params: readonly ["&0x1::coin::AggregatableCoin<T0>"];
        readonly return: readonly ["bool"];
    }, {
        readonly name: "is_coin_initialized";
        readonly visibility: "public";
        readonly is_entry: false;
        readonly is_view: true;
        readonly generic_type_params: readonly [{
            readonly constraints: readonly [];
        }];
        readonly params: readonly [];
        readonly return: readonly ["bool"];
    }, {
        readonly name: "merge";
        readonly visibility: "public";
        readonly is_entry: false;
        readonly is_view: false;
        readonly generic_type_params: readonly [{
            readonly constraints: readonly [];
        }];
        readonly params: readonly ["&mut 0x1::coin::Coin<T0>", "0x1::coin::Coin<T0>"];
        readonly return: readonly [];
    }, {
        readonly name: "merge_aggregatable_coin";
        readonly visibility: "friend";
        readonly is_entry: false;
        readonly is_view: false;
        readonly generic_type_params: readonly [{
            readonly constraints: readonly [];
        }];
        readonly params: readonly ["&mut 0x1::coin::AggregatableCoin<T0>", "0x1::coin::Coin<T0>"];
        readonly return: readonly [];
    }, {
        readonly name: "mint";
        readonly visibility: "public";
        readonly is_entry: false;
        readonly is_view: false;
        readonly generic_type_params: readonly [{
            readonly constraints: readonly [];
        }];
        readonly params: readonly ["u64", "&0x1::coin::MintCapability<T0>"];
        readonly return: readonly ["0x1::coin::Coin<T0>"];
    }, {
        readonly name: "name";
        readonly visibility: "public";
        readonly is_entry: false;
        readonly is_view: true;
        readonly generic_type_params: readonly [{
            readonly constraints: readonly [];
        }];
        readonly params: readonly [];
        readonly return: readonly ["0x1::string::String"];
    }, {
        readonly name: "register";
        readonly visibility: "public";
        readonly is_entry: false;
        readonly is_view: false;
        readonly generic_type_params: readonly [{
            readonly constraints: readonly [];
        }];
        readonly params: readonly ["&signer"];
        readonly return: readonly [];
    }, {
        readonly name: "supply";
        readonly visibility: "public";
        readonly is_entry: false;
        readonly is_view: true;
        readonly generic_type_params: readonly [{
            readonly constraints: readonly [];
        }];
        readonly params: readonly [];
        readonly return: readonly ["0x1::option::Option<u128>"];
    }, {
        readonly name: "symbol";
        readonly visibility: "public";
        readonly is_entry: false;
        readonly is_view: true;
        readonly generic_type_params: readonly [{
            readonly constraints: readonly [];
        }];
        readonly params: readonly [];
        readonly return: readonly ["0x1::string::String"];
    }, {
        readonly name: "transfer";
        readonly visibility: "public";
        readonly is_entry: true;
        readonly is_view: false;
        readonly generic_type_params: readonly [{
            readonly constraints: readonly [];
        }];
        readonly params: readonly ["&signer", "address", "u64"];
        readonly return: readonly [];
    }, {
        readonly name: "unfreeze_coin_store";
        readonly visibility: "public";
        readonly is_entry: true;
        readonly is_view: false;
        readonly generic_type_params: readonly [{
            readonly constraints: readonly [];
        }];
        readonly params: readonly ["address", "&0x1::coin::FreezeCapability<T0>"];
        readonly return: readonly [];
    }, {
        readonly name: "upgrade_supply";
        readonly visibility: "public";
        readonly is_entry: true;
        readonly is_view: false;
        readonly generic_type_params: readonly [{
            readonly constraints: readonly [];
        }];
        readonly params: readonly ["&signer"];
        readonly return: readonly [];
    }, {
        readonly name: "value";
        readonly visibility: "public";
        readonly is_entry: false;
        readonly is_view: false;
        readonly generic_type_params: readonly [{
            readonly constraints: readonly [];
        }];
        readonly params: readonly ["&0x1::coin::Coin<T0>"];
        readonly return: readonly ["u64"];
    }, {
        readonly name: "withdraw";
        readonly visibility: "public";
        readonly is_entry: false;
        readonly is_view: false;
        readonly generic_type_params: readonly [{
            readonly constraints: readonly [];
        }];
        readonly params: readonly ["&signer", "u64"];
        readonly return: readonly ["0x1::coin::Coin<T0>"];
    }, {
        readonly name: "zero";
        readonly visibility: "public";
        readonly is_entry: false;
        readonly is_view: false;
        readonly generic_type_params: readonly [{
            readonly constraints: readonly [];
        }];
        readonly params: readonly [];
        readonly return: readonly ["0x1::coin::Coin<T0>"];
    }];
    readonly structs: readonly [{
        readonly name: "AggregatableCoin";
        readonly is_native: false;
        readonly abilities: readonly ["store"];
        readonly generic_type_params: readonly [{
            readonly constraints: readonly [];
        }];
        readonly fields: readonly [{
            readonly name: "value";
            readonly type: "0x1::aggregator::Aggregator";
        }];
    }, {
        readonly name: "BurnCapability";
        readonly is_native: false;
        readonly abilities: readonly ["copy", "store"];
        readonly generic_type_params: readonly [{
            readonly constraints: readonly [];
        }];
        readonly fields: readonly [{
            readonly name: "dummy_field";
            readonly type: "bool";
        }];
    }, {
        readonly name: "Coin";
        readonly is_native: false;
        readonly abilities: readonly ["store"];
        readonly generic_type_params: readonly [{
            readonly constraints: readonly [];
        }];
        readonly fields: readonly [{
            readonly name: "value";
            readonly type: "u64";
        }];
    }, {
        readonly name: "CoinInfo";
        readonly is_native: false;
        readonly abilities: readonly ["key"];
        readonly generic_type_params: readonly [{
            readonly constraints: readonly [];
        }];
        readonly fields: readonly [{
            readonly name: "name";
            readonly type: "0x1::string::String";
        }, {
            readonly name: "symbol";
            readonly type: "0x1::string::String";
        }, {
            readonly name: "decimals";
            readonly type: "u8";
        }, {
            readonly name: "supply";
            readonly type: "0x1::option::Option<0x1::optional_aggregator::OptionalAggregator>";
        }];
    }, {
        readonly name: "CoinStore";
        readonly is_native: false;
        readonly abilities: readonly ["key"];
        readonly generic_type_params: readonly [{
            readonly constraints: readonly [];
        }];
        readonly fields: readonly [{
            readonly name: "coin";
            readonly type: "0x1::coin::Coin<T0>";
        }, {
            readonly name: "frozen";
            readonly type: "bool";
        }, {
            readonly name: "deposit_events";
            readonly type: "0x1::event::EventHandle<0x1::coin::DepositEvent>";
        }, {
            readonly name: "withdraw_events";
            readonly type: "0x1::event::EventHandle<0x1::coin::WithdrawEvent>";
        }];
    }, {
        readonly name: "DepositEvent";
        readonly is_native: false;
        readonly abilities: readonly ["drop", "store"];
        readonly generic_type_params: readonly [];
        readonly fields: readonly [{
            readonly name: "amount";
            readonly type: "u64";
        }];
    }, {
        readonly name: "FreezeCapability";
        readonly is_native: false;
        readonly abilities: readonly ["copy", "store"];
        readonly generic_type_params: readonly [{
            readonly constraints: readonly [];
        }];
        readonly fields: readonly [{
            readonly name: "dummy_field";
            readonly type: "bool";
        }];
    }, {
        readonly name: "MintCapability";
        readonly is_native: false;
        readonly abilities: readonly ["copy", "store"];
        readonly generic_type_params: readonly [{
            readonly constraints: readonly [];
        }];
        readonly fields: readonly [{
            readonly name: "dummy_field";
            readonly type: "bool";
        }];
    }, {
        readonly name: "SupplyConfig";
        readonly is_native: false;
        readonly abilities: readonly ["key"];
        readonly generic_type_params: readonly [];
        readonly fields: readonly [{
            readonly name: "allow_upgrades";
            readonly type: "bool";
        }];
    }, {
        readonly name: "WithdrawEvent";
        readonly is_native: false;
        readonly abilities: readonly ["drop", "store"];
        readonly generic_type_params: readonly [];
        readonly fields: readonly [{
            readonly name: "amount";
            readonly type: "u64";
        }];
    }];
};
//# sourceMappingURL=coin.d.ts.map