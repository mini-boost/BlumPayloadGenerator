import fs from "fs";
// @ts-ignore
import {D, F, R} from "../blum-includes/game-BHQ4ZG5B.js";


export type GameId = string
type PayloadType = string

type Clicks = {clicks: number}

interface AssetsClicksType {
    [any: string]: Clicks;
}

type ChallengeType = {
    nonce: number,
    hash: string,
    id: string
}

export type AmountType = {amount: number}

interface EarnedPointsType {
    [any: string]: AmountType;
}

type WasmDataType = {
    gameId: GameId,
    challenge: ChallengeType,
    earnedPoints: EarnedPointsType,
    assetClicks: AssetsClicksType
}

export const trueWASMData = {
    "gameId": "ec4e3774-b5a7-4789-a23b-cc02cb655ca6",
    "challenge": {
        "id": "a9a6fdff-69c5-43a3-8bb7-fdf0f875766f",
        "nonce": 74114,
        "hash": "00001976638fc4d4aea3cdcbeaae2b17eb99306c814dc7e78e89ef448a1895ff"
    },
    "earnedPoints": {
        "BP": {"amount": 219}
    },
    "assetClicks": {
        "CLOVER": {"clicks": 74},
        "FREEZE": {"clicks": 3},
        "BOMB": {"clicks": 0},
        "TRUMP": {"clicks": 10},
        "HARRIS": {"clicks": 19}
    }
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
    return F(wasmData.gameId, wasmData.challenge, wasmData.earnedPoints, wasmData.assetClicks);
}

export function generateChallenge(gameId: GameId) : ChallengeType {
    if (!gameId) throw new GameIdNotSetError();
    try {
        const challengeData = D(gameId)
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

export async function getPayload(gameId: GameId, earnedPoints: EarnedPointsType, assetClicks: AssetsClicksType) {
    const wasmData = {
        gameId: gameId,
        challenge: generateChallenge(gameId),
        earnedPoints: earnedPoints,
        assetClicks: assetClicks
    };
    const payload = generatePayload(wasmData);
    return {payload: payload};
}