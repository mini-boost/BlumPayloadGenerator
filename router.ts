import {Router, type Request, type Response} from "express"
import {StatusCodes} from "http-status-codes"

import {
    generatePayload,
    generateChallenge,
    GameIdNotSetError
} from "./generator.ts"


export const router = Router()


router.get("/status", async (req: Request, res: Response) => {
    console.log(`/status | ${req.hostname}}`)
    res.status(StatusCodes.OK).json({status: "ok"})
})

router.post("/getPayload", async (req: Request, res: Response) => {
    try {
        const gameId = req.body.gameId;
        const earnedAssets = req.body.earnedAssets;

        let wasmData = {
            gameId: gameId,
            challenge: generateChallenge(gameId),
            earnedAssets: earnedAssets
        };
        const payload = generatePayload(wasmData);

        res.status(StatusCodes.OK).json({
            payload: payload,
            ...wasmData,
        })
    } catch (e) {
        const statusCode = e instanceof GameIdNotSetError ? StatusCodes.BAD_REQUEST : StatusCodes.INTERNAL_SERVER_ERROR
        // @ts-ignore
        const error: Error = e
        res.status(statusCode).json({error: error.message})
    }
})

