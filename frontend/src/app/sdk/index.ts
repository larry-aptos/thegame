import { TxnBuilderTypes, Types } from "aptos";
import useSubmitTransaction from "./useSubmitTransaction";

const useSubmitGameTransaction = () => {
  const { submitTransaction } = useSubmitTransaction();

  async function joinGame() {
    const payload: Types.TransactionPayload = {
      type: "entry_function_payload",
      function: `${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}::game_manager::join_game`,
      type_arguments: [],
      arguments: [],
    };
    await submitTransaction(payload);
  }
  return { joinGame };
};

export function constructEntryFuncPayload(
  moduleName: string,
  moduleFunc: string,
  args: Uint8Array[],
): TxnBuilderTypes.TransactionPayloadEntryFunction {
  return new TxnBuilderTypes.TransactionPayloadEntryFunction(
    TxnBuilderTypes.EntryFunction.natural(
      // Fully qualified module name
      `${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}::${moduleName}`,
      // Module function
      moduleFunc,
      [],
      args,
    ),
  );
}

export default useSubmitGameTransaction;
