"use client";

import { Box, Flex, Heading } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { PlayerStatesMap, StateContext } from "../providers";
import { Text } from "@chakra-ui/react";

export default function FunPage() {
  // const { gameState } = useContext(StateContext);
  const dummyPlayerStates: PlayerStatesMap = {
    player1: {
      currentScore: 100,
      finishedCurrentRound: true,
      lost: false,
      uri: "player1.jpg",
    },
    player2: {
      currentScore: 85,
      finishedCurrentRound: true,
      lost: false,
      uri: "player2.jpg",
    },
    player3: {
      currentScore: 70,
      finishedCurrentRound: true,
      lost: false,
      uri: "player3.jpg",
    },
    player4: {
      currentScore: 55,
      finishedCurrentRound: true,
      lost: false,
      uri: "player4.jpg",
    },
    player5: {
      currentScore: 40,
      finishedCurrentRound: true,
      lost: false,
      uri: "player5.jpg",
    },
    player6: {
      currentScore: 25,
      finishedCurrentRound: true,
      lost: false,
      uri: "player6.jpg",
    },
    player7: {
      currentScore: 10,
      finishedCurrentRound: true,
      lost: false,
      uri: "player7.jpg",
    },
    player8: {
      currentScore: 0,
      finishedCurrentRound: true,
      lost: true,
      uri: "player8.jpg",
    },
    player9: {
      currentScore: 0,
      finishedCurrentRound: true,
      lost: true,
      uri: "player9.jpg",
    },
    player10: {
      currentScore: 0,
      finishedCurrentRound: true,
      lost: true,
      uri: "player10.jpg",
    },
  };
  const [playerStates, setPlayerStates] =
    useState<PlayerStatesMap>(dummyPlayerStates);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setPlayerStates((prevState) => {
        const newState = { ...prevState };

        for (const playerId in newState) {
          if (!newState[playerId].lost) {
            newState[playerId].lost = true;
            break;
          }
        }

        return newState;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const playerSquares = Object.entries(playerStates).map(
    ([playerId, state]) => (
      <Box
        key={playerId}
        w={`${Object.entries(playerStates).length * 10}px`}
        h={`${Object.entries(playerStates).length * 10}px`}
        bg={state.lost ? "gray" : "green.300"}
        borderRadius="md"
        display="flex"
        justifyContent="center"
        alignItems="center"
        m="8px"
      >
        <Flex direction="column" align="center">
          <Text>Player ID: {playerId}</Text>
          <Text>Score: {state.currentScore}</Text>
        </Flex>
      </Box>
    ),
  );

  return (
    <Box>
      <Heading>DASHBOARD</Heading>
      <Flex flexWrap="wrap">{playerSquares}</Flex>
    </Box>
  );
}
