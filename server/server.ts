import express, {Express} from "express";
import dotenv from 'dotenv';
import {Server} from "socket.io";
import cors from "cors";
import http from "http";
import { advanceGame, closeJoining, endGame, initGame } from "./sdk";
import { AptosClient, Types } from "aptos";

dotenv.config();

export enum GameStatus {
  STARTED = "STARTED",
  JOINING = "JOINING",
  ENDED = "ENDED",
  UNKNOWN = "UNKNOWN",
}

export interface PlayerScoreMap {
  [playerId: string]: number;
}

export interface PlayerState {
  currentScore: number;
  finishedCurrentRound: boolean;
  lost: boolean;
  uri: string;
}

export interface GameState {
  gameStatus: GameStatus;
  wonPlayers: string[];
  lostPlayers: string[];
  numWinners: number;
  playerScore: PlayerScoreMap;
  playerState: PlayerStatesMap;
}

export interface RoundState {
  currentRoundStartTimestamp: number;
}

export interface PlayerStatesMap {
  [playerId: string]: PlayerState;
}

export interface State {
  gameState: GameState;
  playerState: PlayerStatesMap;
  roundState: RoundState;
  updateGameState: (newState: GameState) => void;
  updatePlayerState: (newState: PlayerStatesMap) => void;
  updateRoundState: (newState: RoundState) => void;
}

export const app: Express = express();
const server = http.createServer(app);

const port = process.env.PORT || 8000;
const socketIO = new Server(server);

app.use(cors());

socketIO.on("connect", async (socket) => {
  const latestState = await viewLatestStates();
  
  if (latestState.length === 0) {
    socket.emit("initGame");
  } else {

  }

  console.log(`A user connected ${socket.id}`);

  socket.on("initGame", async () => {
    await initGame(60, 100000000, 50, 1);
  })

  // listen for join game
  socket.on("joinGame", async (address) => {
    // await joinGame("token_name", "token_description", "token_uri");

  })

  // listen for close joining
  socket.on("closeJoiningg", async () => {
    await closeJoining();
  })

  socket.on("initGame", async (data) => {
    console.log("Initializing game...");
    // Call your initGame function here and emit results to the client
    await initGame(data.secsBtwRounds, data.buyAmount, data.maxPlayers, data.numMaxWinners)
      .then((response) => {
        console.log("Game initialized:", response);
        // socket.emit("initGameResponse", response);
      })
      .catch((error) => {
        console.error("Error initializing game:", error);
        // socket.emit("initGameResponse", { error: error.message });
      });
  });

  socket.on("advanceGame", async (data) => {
    console.log("Advancing game...");
    // Call your advanceGame function here and emit results to the client
    await advanceGame(data.playerLost, data.playerWon)
      .then((response) => {
        console.log("Game advanced:", response);
        // socket.emit("advanceGameResponse", response);
      })
      .catch((error) => {
        console.error("Error advancing game:", error);
        // socket.emit("advanceGameResponse", { error: error.message });
      });
  });

  socket.on("endGame", async () => {
    console.log("Ending the game...");
    // Call your endGame function here and emit results to the client
    await endGame()
      .then((response) => {
        console.log("Game ended:", response);
        // socket.emit("endGameResponse", response);
      })
      .catch((error) => {
        console.error("Error ending the game:", error);
        // socket.emit("endGameResponse", { error: error.message });
      });
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    socket.disconnect(true);
  });
});

export async function viewLatestStates(
): Promise<Types.MoveValue[]> {
  const payload: Types.ViewRequest = {
    function: `${process.env.CONTRACT_ADDRESS}::game_manager::view_latest_states`,
    type_arguments: [],
    arguments: [],
  };
  const client = new AptosClient("https://fullnode.devnet.aptoslabs.com");
  return client.view(payload);
}

server.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
