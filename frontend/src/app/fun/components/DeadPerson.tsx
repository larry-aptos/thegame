import { Box, Text, Image } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { CloseIcon } from "@chakra-ui/icons";

type DeadPersonProps = {
  state: any;
  playerId: string;
};

export default function DeadPerson({ state, playerId }: DeadPersonProps) {
  return (
    <Box>
      <Box className={["image-wrapper"]}>
        <Text mt="2" align="center" fontSize="15px">
          {playerId}
        </Text>
        <Image src={state.uri} alt={playerId} className={["image-element"]} />
        <CloseIcon color="red.500" className={"x-icon"} />
      </Box>
      <Text mt="6" align="center" fontSize="20px" color="red" fontWeight="bold">
        {Countdown(state.currentScore)}
      </Text>
    </Box>
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
