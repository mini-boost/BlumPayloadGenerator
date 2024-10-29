import fs from "fs";
import {B, F, R} from "./dumps/game-Bg7iVTVS";


export type GameId = string
type PayloadType = string
type Amount = {amount: string}
type CloverAssetsType = {CLOVER: Amount}
type DogsAssetsType = {Dogs: Amount}
export type EarnedAssetsType = CloverAssetsType | DogsAssetsType

type ChallengeType = {
    nonce: number,
    hash: string,
    id: string
}

type WasmDataType = {
    gameId: GameId,
    challenge: ChallengeType,
    earnedAssets: EarnedAssetsType
}

export class GameIdNotSetError extends Error {
    message = "gameId not set from json body"
}

export async function loadWasmFileForGenerator(gameWasmFile: string) {
    const file = fs.readFileSync(gameWasmFile);
    await R(file);
}

export const generateUUID = () => {
    const generateUUID = (mask: string) => {
        const base = (Math.random() * 16) | 0;
        return (mask === "x" ? base : (base & 3) | 8).toString(16);
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, generateUUID);
}

export function generatePayload(wasmData: WasmDataType) : PayloadType {
    return B(wasmData.gameId, wasmData.challenge, wasmData.earnedAssets);
}

export function generateChallenge(gameId: GameId) : ChallengeType {
    if (!gameId) throw new GameIdNotSetError();
    const challengeData = F(gameId)
    return {id: generateUUID(), ...challengeData};
}

export async function getPayload(gameId: GameId, earnedAssets: EarnedAssetsType) {
    const wasmData = {
        gameId: gameId,
        challenge: generateChallenge(gameId),
        earnedAssets: earnedAssets
    };
    const payload = generatePayload(wasmData);
    return {payload: payload};
}