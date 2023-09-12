import {
  AptosClient,
  FailedTransactionError,
  TxnBuilderTypes,
  Types,
} from "aptos";
import { useEffect, useState } from "react";
import { NetworkName, useWallet } from "@aptos-labs/wallet-adapter-react";
import { DEVNET_FULLNODE } from "../util";
import { adminAccount } from "../account/account";

export type TransactionResponse =
  | TransactionResponseOnSubmission
  | TransactionResponseOnError;

// "submission" here means that the transaction is posted on chain and gas is paid.
// However, the status of the transaction might not be "success".
export type TransactionResponseOnSubmission = {
  transactionSubmitted: true;
  transactionHash: string;
  success: boolean; // indicates if the transaction submitted but failed or not
  message?: string; // error message if the transaction failed
};

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
    const aptosClient = new AptosClient(DEVNET_FULLNODE);

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

const useSubmitTransaction = () => {
  const [transactionResponse, setTransactionResponse] =
    useState<TransactionResponse | null>(null);
  const [transactionInProcess, setTransactionInProcess] =
    useState<boolean>(false);
  const { signAndSubmitTransaction } = useWallet();

  useEffect(() => {
    if (transactionResponse !== null) {
      setTransactionInProcess(false);
    }
  }, [transactionResponse]);

  async function submitTransaction(payload: Types.TransactionPayload) {
    setTransactionInProcess(true);

    const signAndSubmitTransactionCall = async (
      transactionPayload: Types.TransactionPayload,
    ): Promise<TransactionResponse> => {
      const aptosClient = new AptosClient(DEVNET_FULLNODE);
      const responseOnError: TransactionResponseOnError = {
        transactionSubmitted: false,
        message: "Unknown Error",
      };

      let response;
      try {
        response = await signAndSubmitTransaction(transactionPayload);

        // transaction submit succeed
        if ("hash" in response) {
          await aptosClient.waitForTransaction(response["hash"], {
            checkSuccess: true,
          });
          return {
            transactionSubmitted: true,
            transactionHash: response["hash"],
            success: true,
          };
        }
        // transaction failed
        return { ...responseOnError, message: response.message };
      } catch (error: any) {
        if (error instanceof FailedTransactionError) {
          return {
            transactionSubmitted: true,
            transactionHash: response ? response.hash : "",
            message: error.message,
            success: false,
          };
        }
        responseOnError.message = error;
      }
      return responseOnError;
    };

    await signAndSubmitTransactionCall(payload).then(setTransactionResponse);
  }

  function clearTransactionResponse() {
    setTransactionResponse(null);
  }

  return {
    submitTransaction,
    submitAdminTransaction,
    transactionInProcess,
    transactionResponse,
    clearTransactionResponse,
  };
};

export default useSubmitTransaction;
