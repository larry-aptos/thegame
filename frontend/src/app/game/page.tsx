"use client";

import { useContext, useEffect, useState } from "react";
import { StateContext } from "../providers";
import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

export default function ReactionTimeGame() {
  const context = useContext(StateContext);
  const { account } = useWallet();

  const [isRedBoxVisible, setIsRedBoxVisible] = useState(true);
  const [isGreenBoxVisible, setIsGreenBoxVisible] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [hasFailed, setHasFailed] = useState(false);

  const handleClick = () => {
    if (isRedBoxVisible) {
      // Player clicked on the red box, mark them as lost
      const currentPlayerState = context.playerState[account?.address!];
      if (currentPlayerState) {
        const updatedPlayerState = {
          ...currentPlayerState,
          lost: true,
        };
        context.updatePlayerState({
          ...context.playerState,
          [account?.address!]: updatedPlayerState,
        });
      }
      setHasFailed(true);
    } else if (isGreenBoxVisible) {
      // Player clicked on the green box, update their score
      const endTime = new Date().getTime();
      if (startTime !== null) {
        const timeDifference = endTime - startTime;

        // Update the player's score based on the time difference
        const currentPlayerState = context.playerState[account?.address!];
        if (currentPlayerState) {
          const updatedPlayerState = {
            ...currentPlayerState,
            currentScore: timeDifference,
          };
          context.updatePlayerState({
            ...context.playerState,
            [account?.address!]: updatedPlayerState,
          });
        }

        setReactionTime(timeDifference);
      }
      setIsRedBoxVisible(false);
      setIsGreenBoxVisible(false);
    }
  };

  useEffect(() => {
    const randomDelay = Math.floor(Math.random() * 5000) + 1000;
    const timeout = setTimeout(() => {
      setIsRedBoxVisible(false);
      setIsGreenBoxVisible(true);
      setStartTime(new Date().getTime());
    }, randomDelay);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <Box textAlign="center" w="100%" h="50%">
      <Heading>!Attention Please!</Heading>
      {isRedBoxVisible ? (
        <Flex height="100%">
          <Box bg="#CE3626" onClick={handleClick} width={"100%"}>
            <Heading>Wait For Green!</Heading>
          </Box>
        </Flex>
      ) : isGreenBoxVisible ? (
        <Flex height="100%">
          <Box bg="#4BDB6A" onClick={handleClick} width={"100%"}>
            <Text>Click Me Now!</Text>
          </Box>
        </Flex>
      ) : (
        <div>
          {hasFailed ? (
            <Heading color="red">You clicked too early. You failed!</Heading>
          ) : (
            <Heading>Your reaction time: {reactionTime} milliseconds</Heading>
          )}
        </div>
      )}
    </Box>
  );
}
