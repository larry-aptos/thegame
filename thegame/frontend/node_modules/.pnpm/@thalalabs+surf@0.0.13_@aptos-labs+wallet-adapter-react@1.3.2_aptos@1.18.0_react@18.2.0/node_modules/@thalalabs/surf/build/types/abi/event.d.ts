export declare const EVENT_ABI: {
    readonly address: "0x1";
    readonly name: "event";
    readonly friends: readonly ["0x1::account", "0x1::object"];
    readonly exposed_functions: readonly [{
        readonly name: "counter";
        readonly visibility: "public";
        readonly is_entry: false;
        readonly is_view: false;
        readonly generic_type_params: readonly [{
            readonly constraints: readonly ["drop", "store"];
        }];
        readonly params: readonly ["&0x1::event::EventHandle<T0>"];
        readonly return: readonly ["u64"];
    }, {
        readonly name: "destroy_handle";
        readonly visibility: "public";
        readonly is_entry: false;
        readonly is_view: false;
        readonly generic_type_params: readonly [{
            readonly constraints: readonly ["drop", "store"];
        }];
        readonly params: readonly ["0x1::event::EventHandle<T0>"];
        readonly return: readonly [];
    }, {
        readonly name: "emit_event";
        readonly visibility: "public";
        readonly is_entry: false;
        readonly is_view: false;
        readonly generic_type_params: readonly [{
            readonly constraints: readonly ["drop", "store"];
        }];
        readonly params: readonly ["&mut 0x1::event::EventHandle<T0>", "T0"];
        readonly return: readonly [];
    }, {
        readonly name: "guid";
        readonly visibility: "public";
        readonly is_entry: false;
        readonly is_view: false;
        readonly generic_type_params: readonly [{
            readonly constraints: readonly ["drop", "store"];
        }];
        readonly params: readonly ["&0x1::event::EventHandle<T0>"];
        readonly return: readonly ["&0x1::guid::GUID"];
    }, {
        readonly name: "new_event_handle";
        readonly visibility: "friend";
        readonly is_entry: false;
        readonly is_view: false;
        readonly generic_type_params: readonly [{
            readonly constraints: readonly ["drop", "store"];
        }];
        readonly params: readonly ["0x1::guid::GUID"];
        readonly return: readonly ["0x1::event::EventHandle<T0>"];
    }];
    readonly structs: readonly [{
        readonly name: "EventHandle";
        readonly is_native: false;
        readonly abilities: readonly ["store"];
        readonly generic_type_params: readonly [{
            readonly constraints: readonly ["drop", "store"];
        }];
        readonly fields: readonly [{
            readonly name: "counter";
            readonly type: "u64";
        }, {
            readonly name: "guid";
            readonly type: "0x1::guid::GUID";
        }];
    }];
};
//# sourceMappingURL=event.d.ts.map