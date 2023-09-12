"use client";

import { Box, Flex, Heading, Text, Image } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { PlayerStatesMap } from "../providers";
import DeadPerson from "./components/DeadPerson";
import { CloseIcon } from "@chakra-ui/icons";

export default function FunPage() {
  const previousScoreSaver: any[] = [];

  // const { gameState } = useContext(StateContext);
  const dummyPlayerStates: PlayerStatesMap = {
    1: {
      currentScore: 100,
      finishedCurrentRound: true,
      lost: false,
      uri: "https://storage.googleapis.com/space-fighters-assets/alligator1.png",
    },
    2: {
      currentScore: 85,
      finishedCurrentRound: true,
      lost: false,
      uri: "https://storage.googleapis.com/space-fighters-assets/alligator1.png",
    },
    3: {
      currentScore: 70,
      finishedCurrentRound: true,
      lost: false,
      uri: "https://storage.googleapis.com/space-fighters-assets/alligator1.png",
    },
    4: {
      currentScore: 55,
      finishedCurrentRound: true,
      lost: false,
      uri: "https://storage.googleapis.com/space-fighters-assets/alligator1.png",
    },
    5: {
      currentScore: 40,
      finishedCurrentRound: true,
      lost: false,
      uri: "https://storage.googleapis.com/space-fighters-assets/alligator1.png",
    },
    6: {
      currentScore: 25,
      finishedCurrentRound: true,
      lost: false,
      uri: "https://storage.googleapis.com/space-fighters-assets/alligator1.png",
    },
    7: {
      currentScore: 10,
      finishedCurrentRound: true,
      lost: false,
      uri: "https://storage.googleapis.com/space-fighters-assets/alligator1.png",
    },
    8: {
      currentScore: 56,
      finishedCurrentRound: true,
      lost: false,
      uri: "https://storage.googleapis.com/space-fighters-assets/alligator1.png",
    },
    9: {
      currentScore: 5,
      finishedCurrentRound: true,
      lost: false,
      uri: "https://storage.googleapis.com/space-fighters-assets/alligator1.png",
    },
    10: {
      currentScore: 60,
      finishedCurrentRound: true,
      lost: false,
      uri: "https://storage.googleapis.com/space-fighters-assets/alligator1.png",
    },
    11: {
      currentScore: 77,
      finishedCurrentRound: true,
      lost: false,
      uri: "https://storage.googleapis.com/space-fighters-assets/alligator1.png",
    },
    12: {
      currentScore: 25,
      finishedCurrentRound: true,
      lost: false,
      uri: "https://storage.googleapis.com/space-fighters-assets/alligator1.png",
    },
    13: {
      currentScore: 21,
      finishedCurrentRound: true,
      lost: false,
      uri: "https://storage.googleapis.com/space-fighters-assets/alligator1.png",
    },
    14: {
      currentScore: 78,
      finishedCurrentRound: true,
      lost: false,
      uri: "https://storage.googleapis.com/space-fighters-assets/alligator1.png",
    },
    15: {
      currentScore: 59,
      finishedCurrentRound: true,
      lost: false,
      uri: "https://storage.googleapis.com/space-fighters-assets/alligator1.png",
    },
  };
  const [playerStates, setPlayerStates] =
    useState<PlayerStatesMap>(dummyPlayerStates);

  const getState = async () => {
    // call server to know game state
    const response = await fetch("your-server-endpoint");
    const newState = await response.json();
    return newState;
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newState: any = getState();

      const updatedPlayerStates = { ...playerStates };

      Object.keys(newState).forEach((playerId) => {
        if (updatedPlayerStates[playerId]) {
          // Check if the player exists in the local state
          const newScore = newState[playerId].currentScore;
          const localScore = updatedPlayerStates[playerId].currentScore;

          if (newScore !== localScore) {
            // Update the local state if the scores are different
            previousScoreSaver.push(localScore);
            updatedPlayerStates[playerId].currentScore = newScore;
          }
        }
      });

      setPlayerStates(updatedPlayerStates);

      // setPlayerStates((prevState) => {
      //   const newState = { ...prevState };

      //   for (const playerId in newState) {
      //     console.log(playerId);
      //     if (!newState[playerId].lost && playerId % 3 === 0) {
      //       newState[playerId].lost = true;
      //       break;
      //     }
      //   }

      //   return newState;
      // });
    }, 500);

    return () => clearInterval(intervalId);
  }, []);

  const playerSquares = Object.entries(playerStates).map(
    ([playerId, state]) => (
      <Box
        key={playerId}
        w={`${Object.entries(playerStates).length * 10}px`}
        h={`${Object.entries(playerStates).length * 17}px`}
        bg={state.lost ? "gray.400" : "green.300"}
        borderRadius="md"
        justifyContent="center"
        alignItems="center"
        m="8px"
      >
        <Box>
          {state.lost ? (
            <Box>
              <Box className={"image-wrapper"}>
                <Text mt="2" align="center" fontSize="15px">
                  {playerId}
                </Text>
                <Image
                  src={state.uri}
                  alt={playerId}
                  className={"image-element"}
                />
                <CloseIcon color="red.500" className={"x-icon"} />
              </Box>
              <Text
                mt="6"
                align="center"
                fontSize="20px"
                color="red"
                fontWeight="bold"
              >
                {Count(
                  previousScoreSaver[parseInt(playerId)],
                  state.currentScore
                )}
              </Text>
            </Box>
          ) : (
            <>
              <Text mt="2" align="center" fontSize="15px">
                {playerId}
              </Text>
              <Image src={state.uri} alt={playerId} />
              <Text mt="6" mb="2" align="center" fontSize="20px">
                {state.currentScore}
              </Text>
            </>
          )}
        </Box>
      </Box>
    )
  );

  return (
    <Box>
      <Heading>DASHBOARD</Heading>
      <Flex flexWrap="wrap">{playerSquares}</Flex>
    </Box>
  );
}

function Count(startNumber: any, endNumber: any) {
  // if (endNumber === 0) {
  //   return Countdown(startNumber);
  // }
  const [count, setCount] = useState(startNumber);

  useEffect(() => {
    const interval = setInterval(() => {
      if (count <= endNumber) {
        setCount(count + 1);
      }
    }, 15);

    // Cleanup the interval when the component unmounts
    return () => clearInterval(interval);
  }, [count]);

  return (
    <div>
      <h1>{count} APT</h1>
    </div>
  );
}

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
      <h1>{count} APT</h1>
    </div>
  );
}
