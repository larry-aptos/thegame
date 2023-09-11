"use client";

import { ChakraProvider, Flex, theme } from "@chakra-ui/react";
import {
  AptosWalletAdapterProvider,
  Wallet,
} from "@aptos-labs/wallet-adapter-react";
import { PetraWallet } from "petra-plugin-wallet-adapter";
import { WalletConnector } from "./wallet/WalletConnector";

export function Providers({ children }: { children: React.ReactNode }) {
  const wallets: Wallet[] = [new PetraWallet()];

  return (
    <ChakraProvider theme={theme}>
      <AptosWalletAdapterProvider
        plugins={wallets}
        autoConnect={true}
        onError={(error) => {
          console.log("error", error);
        }}
      >
        <Flex direction="column" align="flex-end" pr={5} pt={5}>
          <WalletConnector />
        </Flex>
        <Flex direction="column" align="center">
          {children}
        </Flex>
      </AptosWalletAdapterProvider>
    </ChakraProvider>
  );
}
