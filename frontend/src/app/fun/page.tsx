"use client";

import { Box, Flex, Heading, Text, Image } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { GameState } from "../providers";
// import DeadPerson from "./components/DeadPerson";
import { CloseIcon } from "@chakra-ui/icons";

export default function FunPage() {
  const previousScoreSaver: any[] = [];

  // const { gameState } = useContext(StateContext);

  //const [playerStates, setPlayerStates] = useState<PlayerStatesMap>({});
  const [gameState, setGameState] = useState<GameState>();
  const [count, setCount] = useState(10);

  const getState = async () => {
    // call server to know game state
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/view_state`,
    );
    const newState = await response.json();
    return newState;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (count > 0) {
        setCount(count - 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [count]);

  useEffect(() => {
    // Cleanup the interval when the component unmounts

    const intervalId = setInterval(async () => {
      const newState: GameState = await getState();
      setGameState(newState);
    }, 500);

    return () => clearInterval(intervalId);
  }, []);

  const playerSquares = gameState?.latestPlayerState
    ? Object.entries(gameState?.latestPlayerState).map(([playerId, state]) => (
        <Box
          key={state.token_index}
          w={`200px`}
          h={`200px`}
          bg={state.is_alive ? "green.300" : "gray.400"}
          borderRadius="md"
          justifyContent="center"
          alignItems="center"
          m="8px"
        >
          <Box key={state.token_index}>
            {state.is_alive ? (
              <>
                <Text mt="2" align="center" fontSize="15px">
                  {state.token_index}
                </Text>
                <Image src={state.nft_uri} className={"image-element-alive"} />
                <Text mt="6" mb="2" align="center" fontSize="20px">
                  {state.potential_winning / 1e8}
                </Text>
              </>
            ) : (
              <Box key={state.token_index}>
                <Box className={"image-wrapper"}>
                  <Text mt="2" align="center" fontSize="15px">
                    {state.token_index}
                  </Text>
                  <Image src={state.nft_uri} className={"image-element"} />
                  <CloseIcon color="red.500" className={"x-icon"} />
                </Box>
                <Text
                  mt="6"
                  align="center"
                  fontSize="20px"
                  color="red"
                  fontWeight="bold"
                >
                  {state.potential_winning / 1e8}
                </Text>
              </Box>
            )}
          </Box>
        </Box>
      ))
    : null;

  const winnerSquares = gameState?.latestPlayerState
    ? Object.entries(gameState?.latestPlayerState).map(([playerId, state]) => (
        <Box key={playerId}>
          {state.is_alive && (
            <Box
              w={`200px`}
              h={`200px`}
              bg={state.is_alive ? "green.300" : "gray.400"}
              borderRadius="md"
              justifyContent="center"
              alignItems="center"
              m="8px"
            >
              <Box>
                <>
                  <Text mt="2" align="center" fontSize="15px">
                    {state.token_index}
                  </Text>
                  <Image
                    src={state.nft_uri}
                    className={"image-element-alive"}
                  />
                  <Text mt="6" mb="2" align="center" fontSize="20px">
                    {state.potential_winning / 1e8}
                  </Text>
                </>
              </Box>
            </Box>
          )}
        </Box>
      ))
    : null;

  return (
    <>
      {/* game is going */}
      {gameState &&
        (gameState.joinable || gameState.playable) &&
        gameState?.latestPlayerState && (
          <Box>
            <Text>{count}</Text>
            <Heading>DASHBOARD</Heading>
            <Text fontSize="5xl">💰 {gameState?.pool / 1e8}</Text>
            <Flex flexWrap="wrap">{playerSquares}</Flex>
          </Box>
        )}
      {/* end state */}
      {gameState &&
        !gameState.joinable &&
        !gameState.playable &&
        gameState.latestPlayerState && (
          <>
            <div className="firework"></div>
            <div className="firework"></div>
            <div className="firework"></div>
            <div className="firework"></div>
            <div className="firework"></div>
            <div className="firework"></div>
            <div className="firework"></div>
            <div className="firework"></div>
            <div className="firework"></div>
            <div className="firework"></div>
            <div className="firework"></div>
            <div className="firework"></div>
            <div className="firework"></div>
            <div className="firework"></div>
            <div className="firework"></div>

            <Box className="winners">
              <Heading>WINNERS</Heading>
              <Text fontSize="5xl">💰 {gameState?.pool / 1e8}</Text>
              <Flex flexWrap="wrap">{winnerSquares}</Flex>
            </Box>
          </>
        )}
    </>
  );
}

// currentRoundTime + numBtwSecs = round
function Countdown(startNumber: any) {
  const [count, setCount] = useState(startNumber);

  useEffect(() => {
    const interval = setInterval(() => {
      if (count > 0) {
        setCount(count - 1);
      }
    }, 15);

    // Cleanup the interval when the component unmounts
    return () => clearInterval(interval);
  }, [count]);

  return (
    <div>
      <h1>{count}</h1>
    </div>
  );
}
