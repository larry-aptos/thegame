export declare const TABLE_ABI: {
    readonly address: "0x1";
    readonly name: "table";
    readonly friends: readonly ["0x1::table_with_length"];
    readonly exposed_functions: readonly [{
        readonly name: "add";
        readonly visibility: "public";
        readonly is_entry: false;
        readonly is_view: false;
        readonly generic_type_params: readonly [{
            readonly constraints: readonly ["copy", "drop"];
        }, {
            readonly constraints: readonly [];
        }];
        readonly params: readonly ["&mut 0x1::table::Table<T0, T1>", "T0", "T1"];
        readonly return: readonly [];
    }, {
        readonly name: "borrow";
        readonly visibility: "public";
        readonly is_entry: false;
        readonly is_view: false;
        readonly generic_type_params: readonly [{
            readonly constraints: readonly ["copy", "drop"];
        }, {
            readonly constraints: readonly [];
        }];
        readonly params: readonly ["&0x1::table::Table<T0, T1>", "T0"];
        readonly return: readonly ["&T1"];
    }, {
        readonly name: "borrow_mut";
        readonly visibility: "public";
        readonly is_entry: false;
        readonly is_view: false;
        readonly generic_type_params: readonly [{
            readonly constraints: readonly ["copy", "drop"];
        }, {
            readonly constraints: readonly [];
        }];
        readonly params: readonly ["&mut 0x1::table::Table<T0, T1>", "T0"];
        readonly return: readonly ["&mut T1"];
    }, {
        readonly name: "borrow_mut_with_default";
        readonly visibility: "public";
        readonly is_entry: false;
        readonly is_view: false;
        readonly generic_type_params: readonly [{
            readonly constraints: readonly ["copy", "drop"];
        }, {
            readonly constraints: readonly ["drop"];
        }];
        readonly params: readonly ["&mut 0x1::table::Table<T0, T1>", "T0", "T1"];
        readonly return: readonly ["&mut T1"];
    }, {
        readonly name: "borrow_with_default";
        readonly visibility: "public";
        readonly is_entry: false;
        readonly is_view: false;
        readonly generic_type_params: readonly [{
            readonly constraints: readonly ["copy", "drop"];
        }, {
            readonly constraints: readonly [];
        }];
        readonly params: readonly ["&0x1::table::Table<T0, T1>", "T0", "&T1"];
        readonly return: readonly ["&T1"];
    }, {
        readonly name: "contains";
        readonly visibility: "public";
        readonly is_entry: false;
        readonly is_view: false;
        readonly generic_type_params: readonly [{
            readonly constraints: readonly ["copy", "drop"];
        }, {
            readonly constraints: readonly [];
        }];
        readonly params: readonly ["&0x1::table::Table<T0, T1>", "T0"];
        readonly return: readonly ["bool"];
    }, {
        readonly name: "destroy";
        readonly visibility: "friend";
        readonly is_entry: false;
        readonly is_view: false;
        readonly generic_type_params: readonly [{
            readonly constraints: readonly ["copy", "drop"];
        }, {
            readonly constraints: readonly [];
        }];
        readonly params: readonly ["0x1::table::Table<T0, T1>"];
        readonly return: readonly [];
    }, {
        readonly name: "new";
        readonly visibility: "public";
        readonly is_entry: false;
        readonly is_view: false;
        readonly generic_type_params: readonly [{
            readonly constraints: readonly ["copy", "drop"];
        }, {
            readonly constraints: readonly ["store"];
        }];
        readonly params: readonly [];
        readonly return: readonly ["0x1::table::Table<T0, T1>"];
    }, {
        readonly name: "remove";
        readonly visibility: "public";
        readonly is_entry: false;
        readonly is_view: false;
        readonly generic_type_params: readonly [{
            readonly constraints: readonly ["copy", "drop"];
        }, {
            readonly constraints: readonly [];
        }];
        readonly params: readonly ["&mut 0x1::table::Table<T0, T1>", "T0"];
        readonly return: readonly ["T1"];
    }, {
        readonly name: "upsert";
        readonly visibility: "public";
        readonly is_entry: false;
        readonly is_view: false;
        readonly generic_type_params: readonly [{
            readonly constraints: readonly ["copy", "drop"];
        }, {
            readonly constraints: readonly ["drop"];
        }];
        readonly params: readonly ["&mut 0x1::table::Table<T0, T1>", "T0", "T1"];
        readonly return: readonly [];
    }];
    readonly structs: readonly [{
        readonly name: "Box";
        readonly is_native: false;
        readonly abilities: readonly ["drop", "store", "key"];
        readonly generic_type_params: readonly [{
            readonly constraints: readonly [];
        }];
        readonly fields: readonly [{
            readonly name: "val";
            readonly type: "T0";
        }];
    }, {
        readonly name: "Table";
        readonly is_native: false;
        readonly abilities: readonly ["store"];
        readonly generic_type_params: readonly [{
            readonly constraints: readonly ["copy", "drop"];
        }, {
            readonly constraints: readonly [];
        }];
        readonly fields: readonly [{
            readonly name: "handle";
            readonly type: "address";
        }];
    }];
};
//# sourceMappingURL=table.d.ts.map