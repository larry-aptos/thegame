"use client";

import { useContext, useEffect, useState } from "react";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { fetchAPI } from "./util";

type props = {
  handleReplay: (arg: boolean) => void;
};
export default function ReactionTimeGame({ handleReplay }: props) {
  const { account } = useWallet();

  const [isRedBoxVisible, setIsRedBoxVisible] = useState(true);
  const [isGreenBoxVisible, setIsGreenBoxVisible] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [hasFailed, setHasFailed] = useState(false);

  const handleClick = () => {
    if (isRedBoxVisible) {
      setHasFailed(true);
    } else if (isGreenBoxVisible) {
      // Player clicked on the green box, update their score
      const endTime = new Date().getTime();
      if (startTime !== null) {
        const timeDifference = endTime - startTime;

        handleReplay(false);

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

  useEffect(() => {
    if (reactionTime) {
      const payload = JSON.stringify({
        address: account?.address!,
        score: reactionTime,
      });

      fetchAPI("send_score", payload);
    }
  }, [account?.address, reactionTime]);

  return (
    <Box textAlign="center" w="100%" h="50%">
      <Heading>!Attention Please!</Heading>
      {isRedBoxVisible ? (
        <Flex height="500px">
          <Box bg="#CE3626" onClick={handleClick} width={"100%"}>
            <Heading>Wait For Green!</Heading>
          </Box>
        </Flex>
      ) : isGreenBoxVisible ? (
        <Flex height="500px">
          <Box bg="#4BDB6A" onClick={handleClick} width={"100%"}>
            <Text>Click Me Now!</Text>
          </Box>
        </Flex>
      ) : (
        <div>
          {hasFailed ? (
            <Heading color="red">You clicked too early. You failed!</Heading>
          ) : (
            <>
              <Heading>Your reaction time: {reactionTime} milliseconds</Heading>
              <Heading>Waiting for next round...</Heading>
            </>
          )}
        </div>
      )}
    </Box>
  );
}
