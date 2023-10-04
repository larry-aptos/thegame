"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Flex,
  HStack,
  Heading,
  Spinner,
  VStack,
} from "@chakra-ui/react";
import ReactionTimeGame from "./reactionTimeGame";
import useSubmitGameTransaction from "./sdk";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { fetchAPI } from "./util";
import React from "react";
import { useRouter } from "next/navigation";

interface GameState {
  pool: number;
  latestPlayerState: LatestPlayerState;
  maxPlayer: number;
  numBtwSecs: number;
  buyIn: number;
  joinable: boolean;
  playable: boolean;
  round: number;
}

interface PlayerStateView {
  isAlive: boolean;
  wins: number;
  nftUri: string;
  potentialWinning: number;
  tokenIndex: number;
}

interface LatestPlayerState {
  [address: string]: PlayerStateView;
}

export default function LandingPage() {
  const { joinGame } = useSubmitGameTransaction();
  const [isInitGameLoading, setIsInitGameLoading] = useState(false);
  const { account } = useWallet();
  const [isJoining, setIsJoining] = useState(false);
  const [showJoining, setShowJoining] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [startReactionTimeGame, setStartReactionTimeGame] = useState(false);
  const [replay, setReplay] = useState(false);
  const [gameState, setGameState] = useState<GameState>();
  const router = useRouter();
  let localRound = 0;

  const handleReplay = (to: boolean) => {
    setReplay(to);
  };
  // once init game's called, change gamestatus to be JOINING
  // const handleInitializeGame = async () => {
  //   try {
  //     setIsInitGameLoading(true);
  //     fetchAPI("init_game");
  //   } catch (error) {
  //     console.error("Error initializing the game:", error);
  //   } finally {
  //     setIsInitGameLoading(false);
  //     setShowJoining(true);
  //   }
  // };

  // useEffect(() => {
  //   if (showJoining) {
  //   }
  // }, [showJoining]);

  // call joinGame where if users not wallet connected, open up wallet modal instead
  const handleJoinGame = async () => {
    if (account) {
      setIsJoining(true);

      try {
        await joinGame();
      } catch (error) {
        console.error("Error joining the game:", error);
      } finally {
        setIsJoining(false);
      }
    } else {
      setIsWalletModalOpen(true);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedGameState = await fetchAPI("view_state");
        setGameState(fetchedGameState);
        console.log("game state", fetchedGameState);

        const roundFromServer = fetchedGameState?.round;
        console.log("local " + localRound);
        console.log("server " + roundFromServer);

        if (roundFromServer && roundFromServer !== 0) {
          if (roundFromServer !== localRound) {
            handleReplay(true);
            localRound = roundFromServer;
          } else {
            handleReplay(false);
          }
        }
      } catch (error) {
        console.error("Error fetching game state:", error);
      }
    };

    const interval = setInterval(fetchData, 1000);

    return () => clearInterval(interval);
  }, []);

  // const closeWalletModal = () => {
  //   setIsWalletModalOpen(false);
  // };

  // const handleStartGame = async () => {
  //   try {
  //     await fetchAPI("start_game");
  //   } catch (e) {
  //     console.log("Fail to start the game...");
  //   } finally {
  //     setStartReactionTimeGame(true);
  //   }
  // };
  // console.log(startReactionTimeGame);

  function render() {
    if (!gameState?.joinable && !gameState?.playable) {
      return <Heading>Please wait for The Game to get started...</Heading>
    //   localRound = 0;
    //   return (
    //     <Button
    //       onClick={handleInitializeGame}
    //       isLoading={isInitGameLoading}
    //       loadingText="Initializing..."
    //     >
    //       Please Initialize The Game
    //     </Button>
    //   );
    }
    if (gameState?.joinable) {
      return (
        <Flex alignItems={"center"}>
          {gameState?.latestPlayerState &&
          account?.address! in gameState?.latestPlayerState ? (
            <HStack spacing={2}>
              <Spinner size="lg" color="blue.500" />
              <Heading>Waiting for The Game to start...</Heading>
            </HStack>
          ) : (
            <Button
              onClick={handleJoinGame}
              isLoading={isJoining}
              loadingText="Joining..."
              size={"lg"}
            >
              Please Join The Game
            </Button>
          )}
          {/* <Button onClick={handleStartGame} position="fixed" bottom="0">
            Start Game
          </Button> */}
        </Flex>
      );
    }
  }
  if (gameState?.playable) {
    // TODO: add logic to start the game
    return startReactionTimeGame || replay || gameState.playable ? (
      gameState?.latestPlayerState[account?.address!] ? (
        <ReactionTimeGame handleReplay={handleReplay} />
      ) : (
        (() => {
          router.push("/fun");
          return null;
        })()
      )
    ) : null;
  }
  return (
    <VStack width="100%" height="100vh" pt="20%">
      {render()}
    </VStack>
  );
}
