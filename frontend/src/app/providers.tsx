"use client";

import React, { createContext, useState } from "react";
import { ChakraProvider, Flex, theme } from "@chakra-ui/react";
import {
  AptosWalletAdapterProvider,
  Wallet,
} from "@aptos-labs/wallet-adapter-react";
import { PetraWallet } from "petra-plugin-wallet-adapter";
import { WalletConnector } from "./wallet/WalletConnector";

export enum GameStatus {
  STARTED = "STARTED",
  JOINING = "JOINING",
  ENDED = "ENDED",
  UNKNOWN = "UNKNOWN",
}

export interface PlayerScoreMap {
  [playerId: string]: number;
}

export type GameState = {
  gameStatus: GameStatus;
  wonPlayers: string[];
  lostPlayers: string[];
  numWinners: number;
  playerScore: PlayerScoreMap;
  playerState: PlayerStatesMap;
};

export type PlayerState = {
  currentScore: number;
  finishedCurrentRound: boolean;
  lost: boolean;
  uri: string;
};

export type RoundState = {
  currentRoundStartTimestamp: number;
};

export interface PlayerStatesMap {
  [playerId: string]: PlayerState;
}

type ContextState = {
  gameState: GameState;
  playerState: PlayerStatesMap;
  roundState: RoundState;
  updateGameState: (newState: GameState) => void;
  updatePlayerState: (newState: PlayerStatesMap) => void;
  updateRoundState: (newState: RoundState) => void;
};

const defaultContextState: ContextState = {
  gameState: {
    gameStatus: GameStatus.UNKNOWN,
    wonPlayers: [],
    lostPlayers: [],
    numWinners: 0,
    playerScore: {},
    playerState: {},
  },
  playerState: {},
  roundState: { currentRoundStartTimestamp: 0 },
  updateGameState: (newState: GameState) => {},
  updatePlayerState: (newState: PlayerStatesMap) => {},
  updateRoundState: (newState: RoundState) => {},
};

export const StateContext = createContext(defaultContextState || null);

export function Providers({ children }: { children: React.ReactNode }) {
  const wallets: Wallet[] = [new PetraWallet()];
  const [gameState, setGameState] = useState<GameState>(
    defaultContextState.gameState,
  );
  const [roundState, setRoundState] = useState<RoundState>(
    defaultContextState.roundState,
  );
  const [playerState, setPlayerState] = useState<PlayerStatesMap>(
    defaultContextState.playerState,
  );

  const updateGameState = (newState: GameState) => {
    setGameState(newState);
  };

  const updatePlayerState = (newState: PlayerStatesMap) => {
    setPlayerState(newState);
  };
  const updateRoundState = (newState: RoundState) => {
    setRoundState(newState);
  };

  return (
    <ChakraProvider>
      <AptosWalletAdapterProvider
        plugins={wallets}
        autoConnect={true}
        onError={(error) => {
          console.log("error", error);
        }}
      >
        <StateContext.Provider
          value={{
            gameState,
            playerState,
            roundState,
            updateGameState,
            updatePlayerState,
            updateRoundState,
          }}
        >
          <Flex direction="column" align="flex-end" pr={5} pt={5}>
            <WalletConnector />
          </Flex>
          <Flex direction="column" align="center">
            {children}
          </Flex>
        </StateContext.Provider>
      </AptosWalletAdapterProvider>
    </ChakraProvider>
  );
}
