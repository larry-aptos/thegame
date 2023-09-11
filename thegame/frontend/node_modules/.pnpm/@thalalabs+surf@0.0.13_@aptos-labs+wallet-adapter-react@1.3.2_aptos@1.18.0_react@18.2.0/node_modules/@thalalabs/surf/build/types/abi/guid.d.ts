export declare const GUID_ABI: {
    readonly address: "0x1";
    readonly name: "guid";
    readonly friends: readonly ["0x1::account", "0x1::object"];
    readonly exposed_functions: readonly [{
        readonly name: "create";
        readonly visibility: "friend";
        readonly is_entry: false;
        readonly is_view: false;
        readonly generic_type_params: readonly [];
        readonly params: readonly ["address", "&mut u64"];
        readonly return: readonly ["0x1::guid::GUID"];
    }, {
        readonly name: "create_id";
        readonly visibility: "public";
        readonly is_entry: false;
        readonly is_view: false;
        readonly generic_type_params: readonly [];
        readonly params: readonly ["address", "u64"];
        readonly return: readonly ["0x1::guid::ID"];
    }, {
        readonly name: "creation_num";
        readonly visibility: "public";
        readonly is_entry: false;
        readonly is_view: false;
        readonly generic_type_params: readonly [];
        readonly params: readonly ["&0x1::guid::GUID"];
        readonly return: readonly ["u64"];
    }, {
        readonly name: "creator_address";
        readonly visibility: "public";
        readonly is_entry: false;
        readonly is_view: false;
        readonly generic_type_params: readonly [];
        readonly params: readonly ["&0x1::guid::GUID"];
        readonly return: readonly ["address"];
    }, {
        readonly name: "eq_id";
        readonly visibility: "public";
        readonly is_entry: false;
        readonly is_view: false;
        readonly generic_type_params: readonly [];
        readonly params: readonly ["&0x1::guid::GUID", "&0x1::guid::ID"];
        readonly return: readonly ["bool"];
    }, {
        readonly name: "id";
        readonly visibility: "public";
        readonly is_entry: false;
        readonly is_view: false;
        readonly generic_type_params: readonly [];
        readonly params: readonly ["&0x1::guid::GUID"];
        readonly return: readonly ["0x1::guid::ID"];
    }, {
        readonly name: "id_creation_num";
        readonly visibility: "public";
        readonly is_entry: false;
        readonly is_view: false;
        readonly generic_type_params: readonly [];
        readonly params: readonly ["&0x1::guid::ID"];
        readonly return: readonly ["u64"];
    }, {
        readonly name: "id_creator_address";
        readonly visibility: "public";
        readonly is_entry: false;
        readonly is_view: false;
        readonly generic_type_params: readonly [];
        readonly params: readonly ["&0x1::guid::ID"];
        readonly return: readonly ["address"];
    }];
    readonly structs: readonly [{
        readonly name: "GUID";
        readonly is_native: false;
        readonly abilities: readonly ["drop", "store"];
        readonly generic_type_params: readonly [];
        readonly fields: readonly [{
            readonly name: "id";
            readonly type: "0x1::guid::ID";
        }];
    }, {
        readonly name: "ID";
        readonly is_native: false;
        readonly abilities: readonly ["copy", "drop", "store"];
        readonly generic_type_params: readonly [];
        readonly fields: readonly [{
            readonly name: "creation_num";
            readonly type: "u64";
        }, {
            readonly name: "addr";
            readonly type: "address";
        }];
    }];
};
//# sourceMappingURL=guid.d.ts.map