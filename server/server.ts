import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { advanceGame, endGame, forceClearPool, initGame } from "./sdk";
import { AptosClient, Types } from "aptos";

dotenv.config();

interface PlayerStateView {
  isAlive: boolean;
  wins: number;
  nftUri: string;
  potentialWinning: number;
  tokenIndex: number;
}
interface LatestPlayerState {
  [address: string]: PlayerStateView;
}

enum GameStatus {
  NOT_INITED = "NOT_INITED",
  INITED = "INITED",
  STARTED = "STARTED",
  ENDED = "ENDED",
}

interface GameState {
  pool: number;
  latestPlayerState: LatestPlayerState;
  maxPlayer: number;
  numBtwSecs: number;
  currentRound: number;
  gameStatus: GameStatus;
}

interface PlayerScore {
  [address: string]: number;
}

type Score = {
  address: string;
  score: number;
};

export const app: Express = express();
const server = http.createServer(app);

const port = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());

// initialize
let playerScore: PlayerScore = {};
let gameState: GameState = {
  pool: -1,
  latestPlayerState: {},
  maxPlayer: -1,
  numBtwSecs: -1,
  currentRound: -1,
  gameStatus: GameStatus.NOT_INITED
};

app.post("/send_score", (req, res) => {
  try {
    const requestBody = req.body as Score;

    const address = requestBody.address;
    const score = requestBody.score;

    if (address in playerScore) {
      // do nothing cuz we just persist the first score to avoid cheating
    } else {
      playerScore[address] = score;
    }

    return res.status(200).json({ message: "Success" });
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return res.status(400).json({ error: "Invalid JSON in the request body." });
  }
});

app.get('/view_state', async (req, res) => {
  return res.send(JSON.stringify(gameState));
})

app.get("/init_game", async (req, res) => {
  await forceClearPool();
  try {
    gameState.maxPlayer = 50;
    gameState.numBtwSecs = 60;
    gameState.gameStatus = GameStatus.INITED;
    await initGame(gameState.numBtwSecs, 100000000, gameState.maxPlayer , 1);
  } catch (e) {
    console.error("Error init game:", e);
  } finally {
    res.send("Game started");
  }
});

app.get("/start_game", async (req, res) => {
  await advanceGame([], []);
  gameState.gameStatus = GameStatus.STARTED;
  gameState.currentRound += 1;
  return res.status(200).json('Game started...');
})

setInterval(runPeriodically, gameState.numBtwSecs * 1000);
setInterval(runView, 1000);

async function runView() {
  const state = await viewLatestStates();

  const localState: LatestPlayerState = {};
  // @ts-ignore
  state[0].data.map((object)=> {
    localState[object.key] = object.value;
  })
  gameState = {
    ...gameState,
    latestPlayerState: {
      ...gameState.latestPlayerState,
      ...localState,
    },
  };
}

async function runPeriodically() {
  const playerScoreKVPair = Object.entries(playerScore);

  if (playerScoreKVPair.length === 0) {
    // early return if we don't get any players in this round
    return;
  }

  // TODO: first auto fail the value of -1 as they accidentally click on red
  playerScoreKVPair.sort((a, b) => a[1] - b[1]);
  const middleIndex = Math.floor(playerScoreKVPair.length / 2);

  const lowerScores = playerScoreKVPair.slice(0, middleIndex);
  const higherScores = playerScoreKVPair.slice(middleIndex);
  const wonPlayer = lowerScores.map((pair) => pair[0]);
  const lostPlayer = higherScores.map((pair) => pair[0]);

  if (wonPlayer.length <= gameState.maxPlayer || playerScoreKVPair.length == 1) {
    await endGame();
    // reset the state
    playerScore = {};
    gameState = {
      pool: -1,
      latestPlayerState: {},
      maxPlayer: -1,
      numBtwSecs: -1,
      currentRound: -1,
      gameStatus: GameStatus.NOT_INITED
    };
  } else {
    await advanceGame(lostPlayer, wonPlayer);
    gameState.currentRound += 1;
  }
}

export async function viewLatestStates(): Promise<Types.MoveValue[]> {
  const payload: Types.ViewRequest = {
    function: `${process.env.CONTRACT_ADDRESS}::game_manager::view_latest_states`,
    type_arguments: [],
    arguments: [],
  };
  const client = new AptosClient(process.env.NETWORK || "");
  return client.view(payload);
}

server.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
