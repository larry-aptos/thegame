"use client";

import { useContext, useEffect, useState } from "react";
import { StateContext } from "../providers";
import { Box, Button, Heading } from "@chakra-ui/react";

type ReactionTimeGameProps = {
  address: string;
};

export default function ReactionTimeGame({ address }: ReactionTimeGameProps) {
  const context = useContext(StateContext);

  const [isRedBoxVisible, setIsRedBoxVisible] = useState(true);
  const [isGreenBoxVisible, setIsGreenBoxVisible] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [hasFailed, setHasFailed] = useState(false);

  const handleClick = () => {
    if (isRedBoxVisible) {
      // Player clicked on the red box, mark them as lost
      const currentPlayerState = context.playerState[address];
      if (currentPlayerState) {
        const updatedPlayerState = {
          ...currentPlayerState,
          lost: true,
        };
        context.updatePlayerState({
          ...context.playerState,
          [address]: updatedPlayerState,
        });
      }
      setHasFailed(true);
    } else if (isGreenBoxVisible) {
      // Player clicked on the green box, update their score
      const endTime = new Date().getTime();
      if (startTime !== null) {
        const timeDifference = endTime - startTime;

        // Update the player's score based on the time difference
        const currentPlayerState = context.playerState[address];
        if (currentPlayerState) {
          const updatedPlayerState = {
            ...currentPlayerState,
            currentScore: timeDifference,
          };
          context.updatePlayerState({
            ...context.playerState,
            [address]: updatedPlayerState,
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
    <Box textAlign="center">
      <Heading>Reaction Game</Heading>
      {isRedBoxVisible ? (
        <Button onClick={handleClick} variant="outline" colorScheme="red">
          Click Me to Fail
        </Button>
      ) : isGreenBoxVisible ? (
        <Button onClick={handleClick} variant="outline" colorScheme="green">
          Click Me Now!
        </Button>
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
