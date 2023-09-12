import {
  AptosClient,
  FailedTransactionError,
  TxnBuilderTypes,
  Types,
} from "aptos";
import { AptosAccount, HexString } from "aptos";

export type TransactionResponse =
  | TransactionResponseOnSubmission
  | TransactionResponseOnError;
  
  export type TransactionResponseOnSubmission = {
    transactionSubmitted: true;
    transactionHash: string;
    success: boolean; // indicates if the transaction submitted but failed or not
    message?: string; // error message if the transaction failed
  };
  

  export function adminAccount() {
    return new AptosAccount(
      new HexString(process.env.NEXT_PUBLIC_ADMIN_PRIVATE_KEY!).toUint8Array(),
    );
  }
  
export type TransactionResponseOnError = {
  transactionSubmitted: false;
  message: string;
};

export async function submitAdminTransaction(
  payload: TxnBuilderTypes.TransactionPayload,
) {
  const generateSignSubmitWaitForTransactionCall = async (
    transactionPayload: TxnBuilderTypes.TransactionPayload,
  ): Promise<TransactionResponse> => {
    const aptosClient = new AptosClient(process.env.DEVNET_FULLNODE!);

    const response = await aptosClient.generateSignSubmitWaitForTransaction(
      adminAccount(),
      transactionPayload,
    );
    return {
      transactionSubmitted: true,
      transactionHash: response["hash"],
      success: true,
    };
  };

  await generateSignSubmitWaitForTransactionCall(payload);
}
