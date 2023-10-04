"use client"

import { useState } from "react";
import { fetchAPI } from "../util";
import { Button, VStack } from "@chakra-ui/react";

export default function AdminPage() {
  const [isInitGameLoading, setIsInitGameLoading] = useState(false);

  const handleStartGame = async () => {
    try {
      await fetchAPI("start_game");
    } catch (e) {
      console.log("Fail to start the game...");
    } finally {
    }
  };

  // once init game's called, change gamestatus to be JOINING
  const handleInitializeGame = async () => {
    try {
      setIsInitGameLoading(true);
      fetchAPI("init_game");
    } catch (error) {
      console.error("Error initializing the game:", error);
    } finally {
      setIsInitGameLoading(false);
    }
  };
  return (
    <VStack spacing={10} pt={100}>
      <Button
        onClick={handleInitializeGame}
        isLoading={isInitGameLoading}
        loadingText="Initializing..."
      >
        Please Initialize The Game
      </Button>
      <Button onClick={handleStartGame}>
        Start Game
      </Button>
    </VStack>
  );
}
