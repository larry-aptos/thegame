export declare const OPTIONAL_AGGREGATOR_ABI: {
    readonly address: "0x1";
    readonly name: "optional_aggregator";
    readonly friends: readonly ["0x1::coin"];
    readonly exposed_functions: readonly [{
        readonly name: "add";
        readonly visibility: "public";
        readonly is_entry: false;
        readonly is_view: false;
        readonly generic_type_params: readonly [];
        readonly params: readonly ["&mut 0x1::optional_aggregator::OptionalAggregator", "u128"];
        readonly return: readonly [];
    }, {
        readonly name: "destroy";
        readonly visibility: "public";
        readonly is_entry: false;
        readonly is_view: false;
        readonly generic_type_params: readonly [];
        readonly params: readonly ["0x1::optional_aggregator::OptionalAggregator"];
        readonly return: readonly [];
    }, {
        readonly name: "is_parallelizable";
        readonly visibility: "public";
        readonly is_entry: false;
        readonly is_view: false;
        readonly generic_type_params: readonly [];
        readonly params: readonly ["&0x1::optional_aggregator::OptionalAggregator"];
        readonly return: readonly ["bool"];
    }, {
        readonly name: "new";
        readonly visibility: "friend";
        readonly is_entry: false;
        readonly is_view: false;
        readonly generic_type_params: readonly [];
        readonly params: readonly ["u128", "bool"];
        readonly return: readonly ["0x1::optional_aggregator::OptionalAggregator"];
    }, {
        readonly name: "read";
        readonly visibility: "public";
        readonly is_entry: false;
        readonly is_view: false;
        readonly generic_type_params: readonly [];
        readonly params: readonly ["&0x1::optional_aggregator::OptionalAggregator"];
        readonly return: readonly ["u128"];
    }, {
        readonly name: "sub";
        readonly visibility: "public";
        readonly is_entry: false;
        readonly is_view: false;
        readonly generic_type_params: readonly [];
        readonly params: readonly ["&mut 0x1::optional_aggregator::OptionalAggregator", "u128"];
        readonly return: readonly [];
    }, {
        readonly name: "switch";
        readonly visibility: "public";
        readonly is_entry: false;
        readonly is_view: false;
        readonly generic_type_params: readonly [];
        readonly params: readonly ["&mut 0x1::optional_aggregator::OptionalAggregator"];
        readonly return: readonly [];
    }];
    readonly structs: readonly [{
        readonly name: "Integer";
        readonly is_native: false;
        readonly abilities: readonly ["store"];
        readonly generic_type_params: readonly [];
        readonly fields: readonly [{
            readonly name: "value";
            readonly type: "u128";
        }, {
            readonly name: "limit";
            readonly type: "u128";
        }];
    }, {
        readonly name: "OptionalAggregator";
        readonly is_native: false;
        readonly abilities: readonly ["store"];
        readonly generic_type_params: readonly [];
        readonly fields: readonly [{
            readonly name: "aggregator";
            readonly type: "0x1::option::Option<0x1::aggregator::Aggregator>";
        }, {
            readonly name: "integer";
            readonly type: "0x1::option::Option<0x1::optional_aggregator::Integer>";
        }];
    }];
};
//# sourceMappingURL=optional_aggregator.d.ts.map