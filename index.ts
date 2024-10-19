import { B, R, F, A } from "./dumps/game-Bg7iVTVS";
import fs from "fs";

// Assuming the WebAssembly module is already loaded and the B function is available

const uuid = () =>
  "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (ue) => {
    const Yi = (Math.random() * 16) | 0;
    return (ue === "x" ? Yi : (Yi & 3) | 8).toString(16);
  });

const fl = fs.readFileSync("./dumps/game_wasm_bg-BnV071fP.wasm");
async function generateChallenge(id: string) {
  // Load the WebAssembly module
  await R(fl); // Ensure the WASM module is initialized

  // Call the pack method from the WASM module
  const hash = F(id);
  // Return or handle the hash as needed
  return { id: id, ...hash };
}

async function generatePayload(
  id: string,
  gameId: string,
  challenge: unknown,
  earnedAssets: unknown
) {
  // Load the WebAssembly module
  // R(fl); // Ensure the WASM module is initialized

  // Create the payload object as specified
  const r = {
    id: id,
    gameId,
    challenge,
    earnedAssets,
  };

  // Call the pack method from the WASM module
  const hash = B(r.gameId, r.challenge, r.earnedAssets);

  // Return or handle the hash as needed
  return { payload: hash };
}

async function GetPayload(gid: string, points: number, dogs = 0) {
  const uuid1 = uuid();
  const challenge1 = await generateChallenge(gid);
  let r = {
    gameId: gid,
    challenge: {
      ...challenge1,
      id: uuid1,
    },
    earnedAssets: {
      CLOVER: {
        amount: points.toString(),
      },
      // DOGS: {
      //   amount: dogs.toString(),
      // },
    },
  };

  const newPayliad = await generatePayload(
    challenge1?.id,
    r.gameId,
    r.challenge,
    r.earnedAssets
  );
  return {
    payload: newPayliad?.payload,
    ...r,
  };
}

const gid = "5489454e-823b-4487-b6b4-d8ce3beabeb2";
const points = 112;
const dogs = 30;
const gx = await GetPayload(gid, points, dogs);

console.log(gx);

process.exit(0);
