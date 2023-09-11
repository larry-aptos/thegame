export declare const AGGREGATOR_ABI: {
    readonly address: "0x1";
    readonly name: "aggregator";
    readonly friends: readonly [];
    readonly exposed_functions: readonly [{
        readonly name: "add";
        readonly visibility: "public";
        readonly is_entry: false;
        readonly is_view: false;
        readonly generic_type_params: readonly [];
        readonly params: readonly ["&mut 0x1::aggregator::Aggregator", "u128"];
        readonly return: readonly [];
    }, {
        readonly name: "destroy";
        readonly visibility: "public";
        readonly is_entry: false;
        readonly is_view: false;
        readonly generic_type_params: readonly [];
        readonly params: readonly ["0x1::aggregator::Aggregator"];
        readonly return: readonly [];
    }, {
        readonly name: "limit";
        readonly visibility: "public";
        readonly is_entry: false;
        readonly is_view: false;
        readonly generic_type_params: readonly [];
        readonly params: readonly ["&0x1::aggregator::Aggregator"];
        readonly return: readonly ["u128"];
    }, {
        readonly name: "read";
        readonly visibility: "public";
        readonly is_entry: false;
        readonly is_view: false;
        readonly generic_type_params: readonly [];
        readonly params: readonly ["&0x1::aggregator::Aggregator"];
        readonly return: readonly ["u128"];
    }, {
        readonly name: "sub";
        readonly visibility: "public";
        readonly is_entry: false;
        readonly is_view: false;
        readonly generic_type_params: readonly [];
        readonly params: readonly ["&mut 0x1::aggregator::Aggregator", "u128"];
        readonly return: readonly [];
    }];
    readonly structs: readonly [{
        readonly name: "Aggregator";
        readonly is_native: false;
        readonly abilities: readonly ["store"];
        readonly generic_type_params: readonly [];
        readonly fields: readonly [{
            readonly name: "handle";
            readonly type: "address";
        }, {
            readonly name: "key";
            readonly type: "address";
        }, {
            readonly name: "limit";
            readonly type: "u128";
        }];
    }];
};
//# sourceMappingURL=aggregator.d.ts.map