"use client";

import { useContext, useEffect, useState } from "react";
import { GameStatus, StateContext } from "./providers";
import { Box, Button, Spinner } from "@chakra-ui/react";
import ReactionTimeGame from "./game/page";
import useSubmitGameTransaction from "./sdk";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import WalletsModal from "./wallet/WalletModel";
import FunPage from "./fun/page";

export default function LandingPage() {
  const context = useContext(StateContext);
  const { initGame, joinGame, endGame } = useSubmitGameTransaction();
  const [isInitGameLoading, setIsInitGameLoading] = useState(false);
  const { account } = useWallet();
  const [isJoining, setIsJoining] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  // when page loads, if context.gameState.gameStatus === GameStatus.UNKNOWN, init the game
  // if JOINING, show allow for joining button to all the player
  // if STARTED, check wallet address, and get player state, see if player
  // 1. are playing the game 2. played the game and won 3. play the game and lost
  // for 1, do nothing, for 2 & 3, update game state and player state map
  // when each round ends, check for whether we can end the game or not, if so, end the game, change game status,
  // if not, start the next round
  useEffect(() => {});

  // once init game's called, change gamestatus to be JOINING
  const handleInitializeGame = async () => {
    try {
      setIsInitGameLoading(true);

      await initGame(60, 1, 50, 1);
      context.updateGameState({
        ...context.gameState,
        gameStatus: GameStatus.JOINING,
      });
    } catch (error) {
      console.error("Error initializing the game:", error);
    } finally {
      setIsInitGameLoading(false);
    }
  };

  //start a timer countdown for 1 min on the gamestatus from JOINING to STARTED
  useEffect(() => {
    if (context.gameState.gameStatus === GameStatus.JOINING) {
      const timer = setTimeout(() => {
        context.updateGameState({
          ...context.gameState,
          gameStatus: GameStatus.STARTED,
        });
        context.updateRoundState({
          ...context.roundState,
          currentRoundStartTimestamp: Date.now(),
        });
      }, 60000);

      return () => clearTimeout(timer);
    }
  }, [context, context.gameState.gameStatus]);

  // call joinGame where if users not wallet connected, open up wallet modal instead
  const handleJoinGame = async () => {
    if (account) {
      setIsJoining(true);

      try {
        await joinGame("token_name", "token_description", "token_uri");
      } catch (error) {
        console.error("Error joining the game:", error);
      } finally {
        setIsJoining(false);
      }
    } else {
      setIsWalletModalOpen(true);
    }
  };

  const closeWalletModal = () => {
    setIsWalletModalOpen(false);
  };

  const renderComponent = () => {
    switch (context.gameState.gameStatus) {
      case GameStatus.UNKNOWN:
        return (
          <Button
            onClick={handleInitializeGame}
            isLoading={isInitGameLoading}
            loadingText="Initializing..."
          >
            Please Initialize THE Game
          </Button>
        );
      case GameStatus.JOINING:
        return <Button onClick={handleJoinGame}>Please Join THE Game</Button>;
      case GameStatus.STARTED:
        const playerState = context.playerState[account?.address!];
        // game started but player didn't join
        if (!playerState || playerState.lost) {
          return <FunPage />;
        }
        if (playerState.finishedCurrentRound) {
          <Spinner>Waiting for other players to finish...</Spinner>;
        } else {
          return <ReactionTimeGame address={account?.address!} />;
        }
      case GameStatus.ENDED:
        return <FunPage />;
      default:
        return null; // Return null or any other component for the default case
    }
  };

  useEffect(() => {
    if (context.gameState.gameStatus === GameStatus.STARTED) {
      const roundHasEnded = () => {
        const currentTimestamp = Date.now();
        const { currentRoundStartTimestamp } = context.roundState;
        const roundDuration = 10000;
        const currentRoundEndTimestamp =
          currentRoundStartTimestamp + roundDuration;
        return currentTimestamp >= currentRoundEndTimestamp;
      };
      const intervalId = setInterval(() => {
        if (roundHasEnded()) {
          clearInterval(intervalId);
          handleRoundEnd();
        }
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, []);

  const handleRoundEnd = async () => {
    // get all the player score and calculate and update wonplayer and lostplayer based on the score ranking.
    // 50% faster player will be in wonplayer, rest in lostplayer. and then1. if we have wonplayers length <= numWinners,
    // if so, we should end the game by calling endGame, change gamestatus 2. if wonplayers is longer, do nothing else
    const playerScores = Object.keys(context.playerState).map((playerId) => ({
      playerId,
      score: context.playerState[playerId].currentScore,
    }));
    const sortedPlayers = playerScores.sort((a, b) => a.score - b.score);
    const numWinners = Math.ceil(sortedPlayers.length / 2);
    const wonPlayers = sortedPlayers
      .slice(0, numWinners)
      .map((player) => player.playerId);
    const lostPlayers = sortedPlayers
      .slice(numWinners)
      .map((player) => player.playerId);

    context.updateGameState({
      ...context.gameState,
      wonPlayers,
      lostPlayers,
    });

    if (wonPlayers.length <= context.gameState.numWinners) {
      await endGame().then(() => {
        context.updateGameState({
          ...context.gameState,
          gameStatus: GameStatus.ENDED,
        });
      });
    }

    context.updateRoundState({
      ...context.roundState,
      currentRoundStartTimestamp: Date.now(),
    });

    const updatedPlayerState = { ...context.playerState };

    lostPlayers.forEach((playerId) => {
      if (updatedPlayerState[playerId]) {
        updatedPlayerState[playerId].lost = true;
      }
    });

    const currentPlayerId = account?.address;
    if (currentPlayerId && updatedPlayerState[currentPlayerId]) {
      updatedPlayerState[currentPlayerId] = {
        ...updatedPlayerState[currentPlayerId],
        finishedCurrentRound: false,
      };
    }

    context.updatePlayerState(updatedPlayerState);
  };

  return (
    <Box>
      {renderComponent()}
      <WalletsModal
        handleClose={closeWalletModal}
        modalOpen={isWalletModalOpen}
      />
    </Box>
  );
}
