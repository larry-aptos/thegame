import { BCS, TxnBuilderTypes, Types } from "aptos";
import useSubmitTransaction from "./useSubmitTransaction";

const useSubmitGameTransaction = () => {
  const { submitTransaction, submitAdminTransaction, transactionResponse } =
    useSubmitTransaction();

  async function initGame(
    secsBtwRounds: number,
    buyAmount: number,
    maxPlayers: number,
    numMaxWinners: number,
  ) {
    return await submitAdminTransaction(
      constructEntryFuncPayload("game_manager", "init_game", [
        BCS.bcsSerializeUint64(secsBtwRounds),
        BCS.bcsSerializeUint64(buyAmount),
        BCS.bcsSerializeUint64(maxPlayers),
        BCS.bcsSerializeUint64(numMaxWinners),
      ]),
    );
  }

  async function advanceGame(
    playerLost: Types.Address[],
    playerWon: Types.Address[],
  ) {
    // how to serialize vector
    const lostSerializer = new BCS.Serializer();
    const wonSerializer = new BCS.Serializer();
    BCS.serializeVector(
      playerLost.map((p) => TxnBuilderTypes.AccountAddress.fromHex(p)),
      lostSerializer,
    );
    BCS.serializeVector(
      playerWon.map((p) => TxnBuilderTypes.AccountAddress.fromHex(p)),
      wonSerializer,
    );
    return await submitAdminTransaction(
      constructEntryFuncPayload("game_manager", "advance_game", [
        lostSerializer.getBytes(),
        wonSerializer.getBytes(),
      ]),
    );
  }

  async function closeJoining() {
    return await submitAdminTransaction(
      constructEntryFuncPayload("game_manager", "close_joining", []),
    );
  }

  async function endGame() {
    return await submitAdminTransaction(
      constructEntryFuncPayload("game_manager", "end_game", []),
    );
  }

  async function joinGame(
    tokenName: string,
    tokenDescription: string,
    tokenURI: string,
  ) {
    const payload: Types.TransactionPayload = {
      type: "entry_function_payload",
      function: `${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}::game_manager::join_game`,
      type_arguments: [],
      arguments: [tokenName, tokenDescription, tokenURI],
    };
    await submitTransaction(payload);
  }

  return { initGame, joinGame, closeJoining, advanceGame, endGame };
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
