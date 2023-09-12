import express, {Express} from "express";
import dotenv from 'dotenv';
import cors from "cors";
import http from "http";
import { advanceGame, closeJoining, endGame, initGame } from "./sdk";
import { AptosClient, Types } from "aptos";

dotenv.config();

interface PlayerStateView {
  isAlive: boolean,
  wins: number,
  nftUri: string,
  potentialWinning: number,
  tokenIndex: number,
}
interface LatestPlayerState {
  [address: string]: PlayerStateView
}

interface GameState {
  pool: number,
  latestPlayerState: LatestPlayerState,
  maxPlayer: number,
  numBtwSecs: number,
}

interface PlayerScore {
  [address: string]: number,
}

type Score = {
  address: string,
  score: number,
}


export const app: Express = express();
const server = http.createServer(app);

const port = process.env.PORT || 8000;

app.use(cors());

// initialize 
let playerScore: PlayerScore = {};
let gameState: GameState = {
  pool: 0,
  latestPlayerState: {},
  maxPlayer: 1,
  numBtwSecs: 10,
};

app.get("/endGame", (req, res) => {
  
})

app.post('/sendScore', (req, res) => {
  try {
    const requestBody = JSON.parse(req.body) as Score;
    
    const address = requestBody.address;
    const score = requestBody.score;

    if (address in playerScore) {
      // do nothing cuz we just persist the first score to avoid cheating
    } else {
      playerScore[address] = score;
    }
   
    return res.status(200).json({ message: 'Success' });
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return res.status(400).json({ error: 'Invalid JSON in the request body.' });
  }
})


app.get('/game_data', (req, res) => {
  res.send('hello world')
})

app.get('/start_game', async (req, res) => {
  await initGame(60, 100000000, 50, 1);
  startCountdown(10);
  res.send('Game started')
})

async function startCountdown(seconds: number) {
  if (seconds <= 0) {
    await advanceGame([], []);
  } else {
    console.log(`Countdown: ${seconds} seconds remaining`);
    setTimeout(() => {
      startCountdown(seconds - 1);
    }, 1000);
  }
}

// interval for 5 seconds
// call view function to get the state
const interval = setInterval(runPeriodically, gameState.numBtwSecs*1000); // 10000 milliseconds = 10 seconds

async function runPeriodically() {
  const playerScoreKVPair = Object.entries(playerScore);

  if (playerScoreKVPair.length === 0) {
    // early return if we don't get any players in this round
    return;
  }

  playerScoreKVPair.sort((a, b) => a[1] - b[1]);
  const middleIndex = Math.floor(playerScoreKVPair.length / 2);

  const lowerScores = playerScoreKVPair.slice(0, middleIndex);
  const higherScores = playerScoreKVPair.slice(middleIndex);
  const wonPlayer = lowerScores.map((pair) => pair[0]);
  const lostPlayer = higherScores.map((pair) => pair[0]);

  if (wonPlayer.length <= gameState.maxPlayer) {
    await endGame();
  } else {
    await advanceGame(lostPlayer, wonPlayer);
  }
}

// socketIO.on("connect", async (socket) => {
//   const latestState = await viewLatestStates();
  
//   if (latestState.length === 0) {
//     socket.emit("initGame");
//   } else {

//   }

//   console.log(`A user connected ${socket.id}`);

//   socket.on("initGame", async () => {
//     await initGame(60, 100000000, 50, 1);
//   })

//   // listen for join game
//   socket.on("joinGame", async (address) => {
//     // await joinGame("token_name", "token_description", "token_uri");

//   })

//   // listen for close joining
//   socket.on("closeJoiningg", async () => {
//     await closeJoining();
//   })

//   socket.on("initGame", async (data) => {
//     console.log("Initializing game...");
//     // Call your initGame function here and emit results to the client
//     await initGame(data.secsBtwRounds, data.buyAmount, data.maxPlayers, data.numMaxWinners)
//       .then((response) => {
//         console.log("Game initialized:", response);
//         // socket.emit("initGameResponse", response);
//       })
//       .catch((error) => {
//         console.error("Error initializing game:", error);
//         // socket.emit("initGameResponse", { error: error.message });
//       });
//   });

//   socket.on("advanceGame", async (data) => {
//     console.log("Advancing game...");
//     // Call your advanceGame function here and emit results to the client
//     await advanceGame(data.playerLost, data.playerWon)
//       .then((response) => {
//         console.log("Game advanced:", response);
//         // socket.emit("advanceGameResponse", response);
//       })
//       .catch((error) => {
//         console.error("Error advancing game:", error);
//         // socket.emit("advanceGameResponse", { error: error.message });
//       });
//   });

//   socket.on("endGame", async () => {
//     console.log("Ending the game...");
//     // Call your endGame function here and emit results to the client
//     await endGame()
//       .then((response) => {
//         console.log("Game ended:", response);
//         // socket.emit("endGameResponse", response);
//       })
//       .catch((error) => {
//         console.error("Error ending the game:", error);
//         // socket.emit("endGameResponse", { error: error.message });
//       });
//   });

  // Handle disconnection

export async function viewLatestStates(
): Promise<Types.MoveValue[]> {
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
