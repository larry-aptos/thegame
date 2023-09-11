export declare const APTOS_COIN_ABI: {
    readonly address: "0x1";
    readonly name: "aptos_coin";
    readonly friends: readonly ["0x1::genesis"];
    readonly exposed_functions: readonly [{
        readonly name: "claim_mint_capability";
        readonly visibility: "public";
        readonly is_entry: true;
        readonly is_view: false;
        readonly generic_type_params: readonly [];
        readonly params: readonly ["&signer"];
        readonly return: readonly [];
    }, {
        readonly name: "configure_accounts_for_test";
        readonly visibility: "friend";
        readonly is_entry: false;
        readonly is_view: false;
        readonly generic_type_params: readonly [];
        readonly params: readonly ["&signer", "&signer", "0x1::coin::MintCapability<0x1::aptos_coin::AptosCoin>"];
        readonly return: readonly [];
    }, {
        readonly name: "delegate_mint_capability";
        readonly visibility: "public";
        readonly is_entry: true;
        readonly is_view: false;
        readonly generic_type_params: readonly [];
        readonly params: readonly ["signer", "address"];
        readonly return: readonly [];
    }, {
        readonly name: "destroy_mint_cap";
        readonly visibility: "friend";
        readonly is_entry: false;
        readonly is_view: false;
        readonly generic_type_params: readonly [];
        readonly params: readonly ["&signer"];
        readonly return: readonly [];
    }, {
        readonly name: "has_mint_capability";
        readonly visibility: "public";
        readonly is_entry: false;
        readonly is_view: false;
        readonly generic_type_params: readonly [];
        readonly params: readonly ["&signer"];
        readonly return: readonly ["bool"];
    }, {
        readonly name: "initialize";
        readonly visibility: "friend";
        readonly is_entry: false;
        readonly is_view: false;
        readonly generic_type_params: readonly [];
        readonly params: readonly ["&signer"];
        readonly return: readonly ["0x1::coin::BurnCapability<0x1::aptos_coin::AptosCoin>", "0x1::coin::MintCapability<0x1::aptos_coin::AptosCoin>"];
    }, {
        readonly name: "mint";
        readonly visibility: "public";
        readonly is_entry: true;
        readonly is_view: false;
        readonly generic_type_params: readonly [];
        readonly params: readonly ["&signer", "address", "u64"];
        readonly return: readonly [];
    }];
    readonly structs: readonly [{
        readonly name: "AptosCoin";
        readonly is_native: false;
        readonly abilities: readonly ["key"];
        readonly generic_type_params: readonly [];
        readonly fields: readonly [{
            readonly name: "dummy_field";
            readonly type: "bool";
        }];
    }, {
        readonly name: "DelegatedMintCapability";
        readonly is_native: false;
        readonly abilities: readonly ["store"];
        readonly generic_type_params: readonly [];
        readonly fields: readonly [{
            readonly name: "to";
            readonly type: "address";
        }];
    }, {
        readonly name: "Delegations";
        readonly is_native: false;
        readonly abilities: readonly ["key"];
        readonly generic_type_params: readonly [];
        readonly fields: readonly [{
            readonly name: "inner";
            readonly type: "vector<0x1::aptos_coin::DelegatedMintCapability>";
        }];
    }, {
        readonly name: "MintCapStore";
        readonly is_native: false;
        readonly abilities: readonly ["key"];
        readonly generic_type_params: readonly [];
        readonly fields: readonly [{
            readonly name: "mint_cap";
            readonly type: "0x1::coin::MintCapability<0x1::aptos_coin::AptosCoin>";
        }];
    }];
};
//# sourceMappingURL=aptos_coin.d.ts.map