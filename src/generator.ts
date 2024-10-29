import fs from "fs";
import {B, F, R} from "../blum-includes/game-Bg7iVTVS.js";


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

export class WasmFileNotLoadedError extends Error {
    message = 'wasm file not loaded for generator! use "await loadWasmFileForGenerator("game_wasm_bg-BnV071fP.wasm")"'
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
    try {
        const challengeData = F(gameId)
        return {id: generateUUID(), ...challengeData};
    } catch (error) {
        if (error instanceof TypeError &&
            error.message === "Cannot read properties of undefined (reading '__wbindgen_add_to_stack_pointer')"
        ) {
            throw new WasmFileNotLoadedError();
        }
        throw error
    }

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